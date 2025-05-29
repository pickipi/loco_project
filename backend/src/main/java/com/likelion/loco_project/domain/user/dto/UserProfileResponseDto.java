package com.likelion.loco_project.domain.user.dto;

import com.likelion.loco_project.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponseDto {
    private Long id;
    private String imageUrl;

    public static UserProfileResponseDto fromEntity(User user) {
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .imageUrl(user.getImageUrl())
                .build();
    }
}
