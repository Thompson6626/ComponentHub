package com.comphub.auth.token;


import com.comphub.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
public class TokenService {

    @Value("${security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public TokenService(JwtEncoder encoder, JwtDecoder decoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    public String extractUsername(final String token) {
        return decoder.decode(token).getSubject();
    }
    public Instant extractExpiration(final String token) {
        return decoder.decode(token).getExpiresAt();
    }

    public String generateToken(final User user){
        return buildToken(user,jwtExpiration);
    }
    public String generateRefreshToken(final User user){
        return buildToken(user,refreshExpiration);
    }

    public String buildToken(User user,long expireTime) {
        var now = Instant.now();
        // Filtering and only getting everything that its not roles
        String scope = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> !authority.startsWith("ROLE"))
                .collect(Collectors.joining(" "));

        var claims = JwtClaimsSet.builder()
                .id(user.getId().toString())
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(expireTime, ChronoUnit.MILLIS))
                .subject(user.getEmail())
                .claims(cl ->{
                        cl.put("name",user.getUsername());
                        cl.put("scope",scope);
                })
                .build();

        var encoderParameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS512).build(), claims);
        return this.encoder.encode(encoderParameters).getTokenValue();
    }


    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).isBefore(Instant.now());
    }
}
