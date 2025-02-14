package com.comphub.auth.token;

import java.time.LocalDateTime;

public record TokenWrapper(
        String token,
        LocalDateTime expiresIn
) {
}
