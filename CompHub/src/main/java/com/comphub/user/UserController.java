package com.comphub.user;

import com.comphub.common.SimpleResponse;
import com.comphub.user.dto.UpdatePasswordRequest;
import com.comphub.user.dto.UpdateUsernameRequest;
import com.comphub.user.dto.UserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("users")
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserDetails> getUser(
            @PathVariable String username
    ) {
        var userDto = userService.getUserDetails(username);
        return ResponseEntity.ok(userDto);
    }


    @PutMapping("/password")
    public ResponseEntity<SimpleResponse> updatePassword(
            @Valid @RequestBody UpdatePasswordRequest request,
            @AuthenticationPrincipal User user
    ) {
        userService.changePassword(request, user);
        return ResponseEntity.ok(new SimpleResponse("Password changed successfully"));
    }

    @PutMapping("/username")
    public ResponseEntity<SimpleResponse> updateUsername(
            @Valid @RequestBody UpdateUsernameRequest request,
            @AuthenticationPrincipal User user
    ) {
        userService.changeUsername(request, user);
        return ResponseEntity.ok(new SimpleResponse("Username changed successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetails> getUserDetails(@AuthenticationPrincipal User user) {
        var userDto = userService.getUserDetails(user);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/availability/username/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@PathVariable String username) {
        boolean available = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/availability/email/{email}")
    public ResponseEntity<Map<String, Boolean>> checkEmailAvailability(@PathVariable String email) {
        boolean available = userService.isEmailAvailable(email);
        return ResponseEntity.ok(Map.of("available", available));
    }

}
