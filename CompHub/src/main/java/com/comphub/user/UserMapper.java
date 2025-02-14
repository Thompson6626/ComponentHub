package com.comphub.user;

import com.comphub.user.dto.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {


    public UserDetails toDetails(User user){
        return UserDetails.builder()
                .id(user.getId())
                .username(user.getUsername())
                .profilePictureUrl(user.getProfilePictureUrl())
                .joinDate(user.getJoinDate())
                .build();
    }


}
