package com.comphub.auth.controller;


import com.comphub.auth.dto.LoginRequest;
import com.comphub.auth.dto.RegisterRequest;
import com.comphub.auth.dto.ResendVerificationRequest;
import com.comphub.auth.service.AuthService;
import com.comphub.auth.token.TokenResponse;
import com.comphub.common.SimpleResponse;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<SimpleResponse> register(@Valid @RequestBody final RegisterRequest request) throws MessagingException {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SimpleResponse("Verification email has been sent"));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<SimpleResponse> verify(@RequestParam("token") String verificationToken) {
        authService.verify(verificationToken);
        return ResponseEntity.ok(new SimpleResponse("User verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<SimpleResponse> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request
    ) throws MessagingException {
        authService.resendVerificationEmail(request);
        return ResponseEntity.ok(new SimpleResponse("Verification email has been sent"));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> authenticate(@Valid @RequestBody final LoginRequest request) {
        final var token = authService.login(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader
    ) {
        return ResponseEntity.ok(authService.refreshToken(authHeader));
    }


}
