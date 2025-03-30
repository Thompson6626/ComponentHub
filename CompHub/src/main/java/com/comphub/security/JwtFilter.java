package com.comphub.security;


import com.comphub.auth.token.Token;
import com.comphub.auth.token.TokenRepository;
import com.comphub.auth.token.TokenService;
import com.comphub.user.User;
import com.comphub.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;


    // Looking to
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        if (request.getServletPath().contains("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String username = tokenService.extractUsername(jwtToken);

        if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        final Token token = tokenRepository.findByToken(jwtToken)
                .orElse(null);

        if (token == null || token.isExpired() || token.isRevoked()) {
            filterChain.doFilter(request, response);
            return;
        }

        final User user;

        try {
            user = (User) userDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e){
            filterChain.doFilter(request, response);
            return;
        }

        // Invalid Token
        if (!tokenService.isTokenValid(jwtToken, user)) {
            filterChain.doFilter(request, response);
            return;
        }

        final var authToken = new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
