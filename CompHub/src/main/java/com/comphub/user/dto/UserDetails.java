package com.comphub.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserDetails {
    private long id;
    private String username;
    private String profilePictureUrl;
    private LocalDateTime joinDate;
}
