package com.likelion.loco_project.domain.user.dto;

import com.likelion.loco_project.domain.user.entity.UserType;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDto {
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private Set<UserType> type;

    //호스트 페이지에서 바로 회원가입
    private UserType typeHost;
}