package com.likelion.loco_project.domain.user.dto;

import com.likelion.loco_project.domain.user.entity.UserType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private Double rating;
    private UserType userType;
}