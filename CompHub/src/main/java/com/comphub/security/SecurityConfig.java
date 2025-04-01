package com.comphub.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] WHITE_LIST = {
            // Authentication
            "/auth/**",
    };

    private static final String[] GET_PUBLIC_ENDPOINTS = {
            // Component
            "/components",
            "/components/user/{username}/component/{componentName}",
            "/components/{componentId}",
            "/components/user/{username}",
            "/components/category",
            "/components/user/{username}/names",
            // Component file
            "/components/files/{fileId}",
            // Component category
            "/components/category",
            // Users
            "/users/{username}"
    };

    private static final String[] AUTHENTICATED_ENDPOINTS = {
            "/components/**",
            "/components/files/**",
            "/components/category/**"
    };


    private final JwtFilter jwtFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(WHITE_LIST).permitAll()
                        .requestMatchers(GET, GET_PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(POST, "/components").authenticated()
                        .requestMatchers(AUTHENTICATED_ENDPOINTS).authenticated()
                        .requestMatchers(POST, "/components/category").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(DELETE, "/components/{categoryId}").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler(this::clearSecurityContext)
                )
                .build();
    }

    private void clearSecurityContext(HttpServletRequest request, HttpServletResponse response, Authentication auth) {
        SecurityContextHolder.clearContext();
    }

}
