package com.comphub.security;


import com.comphub.auth.token.Token;
import com.comphub.auth.token.TokenRepository;
import com.comphub.auth.token.TokenService;
import com.comphub.user.UserRepository;
import com.comphub.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        if (request.getServletPath().contains("/auth")){
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String username = tokenService.extractUsername(jwtToken);

        if (username == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        final Token token = tokenRepository.findByToken(jwtToken)
                .orElse(null);

        if(token == null || token.isExpired() || token.isRevoked()){
            filterChain.doFilter(request, response);
            return;
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()){
            filterChain.doFilter(request, response);
            return;
        }
        final boolean isTokenValid = tokenService.isTokenValid(jwtToken,user.get());
        if (!isTokenValid){
            return;
        }

        final var authToken = new UsernamePasswordAuthenticationToken(
                user.get(),
                null,
                userDetails.getAuthorities()
        );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
