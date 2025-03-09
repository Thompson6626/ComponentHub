package com.comphub.auth.token;


import com.comphub.user.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Service
public class TokenService {
    @Value("${security.jwt.secret-key}")
    private String secretKey;
    @Value("${security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public TokenWrapper generateToken(final User user) {
        return buildToken(user, refreshExpiration);

    }

    public TokenWrapper generateRefreshToken(final User user) {
        return buildToken(user, refreshExpiration);
    }

    private TokenWrapper buildToken(final User user, final long expiration) {
        var now = LocalDateTime.now();
        var expiresAt = now.plus(expiration, ChronoUnit.MILLIS);

        return new TokenWrapper(
                Jwts
                        .builder()
                        .claims(Map.of("email", user.getEmail()))
                        .subject(user.getUsername())
                        .issuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
                        .expiration(Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()))
                        .signWith(getSignInKey())
                        .compact(),
                expiresAt
        );
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    private SecretKey getSignInKey() {
        final byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
