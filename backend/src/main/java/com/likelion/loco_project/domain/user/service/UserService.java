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
        // 이메일 중복 체크 및 User 엔티티 생성
        User user = createUserEntity(dto);

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

    // 이메일 중복 체크 및 User 엔티티를 생성하는 private 메서드
    private User createUserEntity(UserRequestDto dto) {
        // 이메일 중복 체크
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        return User.builder()
                .username(dto.getUsername())
                .password(encodedPassword)
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .type(dto.getType())
                .rating(0.0)
                .build();
    }

    //주어진 ID로 유저를 조회하는 메서드
    public UserResponseDto getUserById(Long id) {
        return userRepository.findById(id)
                .filter(user -> !user.isDeleted()) // 논리 삭제된 사용자 제외
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .rating(user.getRating())
                        .build())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    //로그인 기능: 이메일과 비밀번호로 사용자 인증
    @Transactional(readOnly = true)
    public UserResponseDto login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .filter(u -> !u.isDeleted()) // 논리 삭제된 사용자 제외
                .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자가 없습니다."));

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

    //유저 정보 수정(Update) 기능
    @Transactional
    public UserResponseDto updateUser(Long id, UserRequestDto dto) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        user.updateUserInfo(dto.getUsername(), dto.getPhoneNumber());

        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .rating(user.getRating())
                .build();
    }

    //유저 정보 물리(바로,즉시) 삭제
    @Transactional
    public void hardDeleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));
        userRepository.delete(user);
    }

    //유저 정보 논리 삭제
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));
        user.delete(); // 논리 삭제 처리
    }

    //알림 수신 설정을 ON/OFF 토글
    @Transactional
    public boolean toggleNotification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        user.setNotificationEnabled(!user.isNotificationEnabled());
        return user.isNotificationEnabled(); // 변경된 상태 반환
    }

    //알림 수신 여부 조회
    @Transactional(readOnly = true)
    public boolean isNotificationEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return user.isNotificationEnabled();
    }
}