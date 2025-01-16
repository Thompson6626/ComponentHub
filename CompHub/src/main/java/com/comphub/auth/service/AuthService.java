package com.comphub.auth.service;

import com.comphub.auth.dto.LoginRequest;
import com.comphub.auth.dto.RegisterRequest;
import com.comphub.auth.email.EmailService;
import com.comphub.auth.email.EmailTemplateName;
import com.comphub.auth.token.Token;
import com.comphub.auth.token.TokenRepository;
import com.comphub.auth.token.TokenResponse;
import com.comphub.auth.token.TokenService;

import com.comphub.exception.EntityAlreadyExistsException;
import com.comphub.exception.TokenExpiredException;
import com.comphub.exception.UserAlreadyEnabledException;
import com.comphub.exception.UserNotEnabledException;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j // Todo DELETE LATER
@Transactional
public class AuthService {

    @Value("${security.verification-token.expiration}")
    private long verificationExpiration;
    @Value("${security.activation_url}")
    private String activationUrl;
    @Value("${security.verification-token.characters}")
    private String CHARACTERS;
    @Value("${security.verification-token.length}")
    private int verificationTokenLength;

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
            throw new EntityAlreadyExistsException("Email is already asociated with an account.");

        String verificationToken = generateVerificationToken();

        var user = User.builder()
                .username(request.username())
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
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isEnabled()){
            throw new UserNotEnabledException("User account is not enabled. Please verify your email.");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.email(),
                    request.password()
            )
        );

        var jwtToken = tokenService.generateToken(user);
        var refreshToken = tokenService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user,jwtToken);
        return new TokenResponse(jwtToken,refreshToken);
    }


    public void verify(String verificationToken) {

        User user = userRepository.findByVerificationToken(verificationToken)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid token"));

        if (!Instant.now().isBefore(user.getVerificationTokenExpiresAt())){
            throw new TokenExpiredException("The verification token has expired");
        }

        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        userRepository.save(user);
    }
    
    public void resendVerificationEmail(String email) throws MessagingException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email '" + email + "' not found"));

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
        final String accessToken = tokenService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user,accessToken);
        return new TokenResponse(accessToken,refreshToken);
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
        log.info("Verification code -> {}{}", activationUrl, verificationToken);
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
