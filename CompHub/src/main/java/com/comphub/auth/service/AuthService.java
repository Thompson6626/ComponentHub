package com.comphub.auth.service;

import com.comphub.auth.dto.LoginRequest;
import com.comphub.auth.dto.RegisterRequest;
import com.comphub.auth.dto.ResendVerificationRequest;
import com.comphub.auth.dto.VerifyEmailRequest;
import com.comphub.auth.email.EmailService;
import com.comphub.auth.email.EmailTemplateName;
import com.comphub.auth.token.Token;
import com.comphub.auth.token.TokenRepository;
import com.comphub.auth.token.TokenResponse;
import com.comphub.auth.token.TokenService;

import com.comphub.exception.*;
import com.comphub.role.Role;
import com.comphub.role.RoleRepository;
import com.comphub.user.User;
import com.comphub.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    @Value("${security.verification-token.expiration}")
    private long verificationExpiration;
    @Value("${security.activation_url}")
    private String activationUrl;
    @Value("${security.verification-token.characters}")
    private String CHARACTERS;
    @Value("${security.verification-token.length}")
    private int verificationTokenLength;

    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public void register(RegisterRequest request) throws MessagingException {
        if (userRepository.existsByUsername(request.username()))
            throw new EntityAlreadyExistsException("Username is already taken.");

        if (userRepository.existsByEmail(request.email()))
            throw new EntityAlreadyExistsException("Email is already associated with an account.");

        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("User role not found."));

        String verificationToken = generateVerificationToken();

        var user = User.builder()
                .username(request.username())
                .role(role)
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .enabled(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiresAt(Instant.now().plus(verificationExpiration, ChronoUnit.MILLIS))
                .build();

        var savedUser = userRepository.save(user);

        sendVerificationEmail(savedUser,verificationToken);
    }

    public TokenResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isEnabled()){
            throw new UserNotEnabledException("User account is not enabled. Please verify your email.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())){
            throw new UnauthorizedAccessException("Wrong password");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.username(),
                    request.password()
            )
        );

        var jwtToken = tokenService.generateToken(user);
        var refreshToken = tokenService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user,jwtToken.token());

        return TokenResponse.builder()
                .accessToken(jwtToken.token())
                .accessTokenExpiresIn(jwtToken.expiresIn())
                .refreshToken(refreshToken.token())
                .refreshTokenExpiresIn(refreshToken.expiresIn())
                .build();
    }


    public void verify(String verificationToken) {

        User user = userRepository.findByVerificationToken(verificationToken)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid token"));

        if (Instant.now().isAfter(user.getVerificationTokenExpiresAt())) {
            throw new TokenExpiredException("The verification token has expired");
        }


        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        userRepository.save(user);
    }
    
    public void resendVerificationEmail(ResendVerificationRequest request) throws MessagingException {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new EntityNotFoundException("User with email '" + request.email() + "' not found"));

        if (user.isEnabled()){
            throw new UserAlreadyEnabledException("User is already enabled");
        }
        String verificationToken = generateVerificationToken();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiresAt(Instant.now().plus(verificationExpiration, ChronoUnit.MILLIS));
        User savedUser = userRepository.save(user);
        sendVerificationEmail(savedUser,verificationToken);
    }

    public TokenResponse refreshToken(final String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            throw new IllegalArgumentException("Invalid Bearer token");
        }
        final String refreshToken = authHeader.substring(7);
        final String userEmail = tokenService.extractUsername(refreshToken);

        if(userEmail == null){
            throw new IllegalArgumentException("Invalid Refresh email");
        }

        final User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!tokenService.isTokenValid(refreshToken,user)){
            throw new TokenExpiredException("Token has expired");
        }
        final var accessToken = tokenService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user,accessToken.token());

        return TokenResponse.builder()
                .accessToken(accessToken.token())
                .accessTokenExpiresIn(accessToken.expiresIn())
                .refreshToken(refreshToken)
                .build();
    }




    private void revokeAllUserTokens(final User user){
        final List<Token> validTokens = tokenRepository.findAllByExpiredIsFalseOrRevokedIsFalseAndUserId(user.getId());
        if (!validTokens.isEmpty()){
            for(final Token token: validTokens){
                token.setExpired(true);
                token.setRevoked(true);
            }
            tokenRepository.saveAll(validTokens);
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        tokenRepository.save(
                Token.builder()
                .user(user)
                .token(jwtToken)
                .type(Token.TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build()
        );
    }

    private void sendVerificationEmail(User user, String verificationToken) throws MessagingException {
        log.info("Verification token {}", verificationToken);
        emailService.sendEmail(
                user.getEmail(),
                user.getUsername(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                verificationToken,
                "Account activation"
        );
    }

    private String generateVerificationToken(){
        var token = new StringBuilder();
        var random = new SecureRandom();
        final int charsLen = CHARACTERS.length();
        for (int i = 0; i < verificationTokenLength; i++) {
            token.append(CHARACTERS.charAt(random.nextInt(charsLen)));
        }
        return token.toString();
    }

}
