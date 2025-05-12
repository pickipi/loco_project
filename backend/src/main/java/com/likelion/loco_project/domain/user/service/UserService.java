package com.likelion.loco_project.domain.user.service;

import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.dto.UserResponseDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 비밀번호 인코더 주입

    //새로운 유저를 생성하고 저장하는 메서드 (회원가입 기능)
    @Transactional
    public UserResponseDto createUser(UserRequestDto dto) {
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .username(dto.getUsername())
                .password(encodedPassword)
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .roles(dto.getRoles())
                .rating(0.0)
                .build();

        User saved = userRepository.save(user); // DB에 저장

        // 저장된 유저를 응답 DTO로 변환해 반환
        return UserResponseDto.builder()
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .phoneNumber(saved.getPhoneNumber())
                .rating(saved.getRating())
                .build();
    }

    //주어진 ID로 유저를 조회하는 메서드
    public UserResponseDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .rating(user.getRating())
                        .build()
                )
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    //로그인 기능: 이메일과 비밀번호로 사용자 인증
    @Transactional(readOnly = true)
    public UserResponseDto login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자가 없습니다."));

        // 비밀번호 비교 (암호화된 비밀번호와 비교)
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .rating(user.getRating())
                .build();
    }
}
