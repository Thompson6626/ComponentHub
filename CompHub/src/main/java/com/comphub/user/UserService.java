package com.comphub.user;

import com.comphub.exception.UserOperationException;
import com.comphub.user.dto.UpdatePasswordRequest;
import com.comphub.user.dto.UpdateUsernameRequest;
import com.comphub.user.dto.UserDetails;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public void changePassword(UpdatePasswordRequest request, User user) {
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BadCredentialsException("The old password is incorrect.");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new UserOperationException("The new password cannot be the same as the old password.");
        }

        if (!request.confirmNewPassword().equals(request.newPassword())) {
            throw new BadCredentialsException("Passwords do not match.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));

        userRepository.save(user);
    }


    public void changeUsername(UpdateUsernameRequest request, User user) {
        if (userRepository.existsByUsername(request.newUsername())) {
            throw new UserOperationException("The new username cannot be the same as the current username.");
        }

        if (user.getUsername().equals(request.newUsername())) {
            throw new UserOperationException("The username '" + request.newUsername() + "' is already taken.");
        }

        user.setUsername(request.newUsername());
        userRepository.save(user);
    }

    public UserDetails getUserDetails(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User with username '" + username + "' not found."));

        return userMapper.toDetails(user);
    }

    public UserDetails getUserDetails(User user) {
        return userMapper.toDetails(user);
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
}
