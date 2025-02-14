package com.comphub.user;

import com.comphub.common.SimpleResponse;
import com.comphub.user.dto.UpdatePasswordRequest;
import com.comphub.user.dto.UpdateUsernameRequest;
import com.comphub.user.dto.UserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserDetails> getUser(
            @PathVariable String username
    ){
        var userDto = userService.getUserDetails(username);
        return ResponseEntity.ok(userDto);
    }


    @PutMapping("/password")
    public ResponseEntity<SimpleResponse> updatePassword(
            @Valid @RequestBody UpdatePasswordRequest request,
            @AuthenticationPrincipal User user
    ) {
        userService.changePassword(request,user);
        return ResponseEntity.ok(new SimpleResponse("Password changed successfully"));
    }

    @PutMapping("/username")
    public ResponseEntity<SimpleResponse> updateUsername(
        @Valid @RequestBody UpdateUsernameRequest request,
        @AuthenticationPrincipal User user
    ){
        userService.changeUsername(request,user);
            return ResponseEntity.ok(new SimpleResponse("Username changed successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetails> getUserDetails(@AuthenticationPrincipal User user){
        var userDto = userService.getUserDetails(user);
        return ResponseEntity.ok(userDto);
    }


}
