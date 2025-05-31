package com.likelion.loco_project.domain.user.service;

import com.likelion.loco_project.domain.auth.EmailAuthManager;
import com.likelion.loco_project.domain.space.dto.SpaceResponseDto;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.user.dto.UserProfileResponseDto;
import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.dto.UserResponseDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.entity.UserType;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.BusinessLogicException;
import com.likelion.loco_project.global.exception.ExceptionCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 비밀번호 인코더 주입
    private final EmailAuthManager emailAuthManager;

    //새로운 유저를 생성하고 저장하는 메서드 (회원가입 기능)
    @Transactional
    public UserResponseDto createUser(UserRequestDto dto) {

        // 이메일 인증 여부 - ADMIN 타입일 경우 건너뛰기
        if (UserType.valueOf(dto.getUserType().toUpperCase()) != UserType.ADMIN) {
            // ADMIN이 아닌 경우에만 이메일 인증 검사를 수행
            if (!emailAuthManager.isVerified(dto.getEmail())) {
                throw new BusinessLogicException(ExceptionCode.EMAIL_NOT_VERIFIED);
            }
        }

        // // 이메일 인증 여부
        // if (!emailAuthManager.isVerified(dto.getEmail())) {
        //     throw new BusinessLogicException(ExceptionCode.EMAIL_NOT_VERIFIED);
        // }

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
                .userType(saved.getUserType())
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
                .userType(UserType.valueOf(dto.getUserType().toUpperCase())) // 문자열 → enum
                .rating(0.0)
                .build();
    }

    // 카카오 유저 회원가입
    @Transactional
    public User registerOAuthUser(String email, String username, UserType type) {
        // 이메일 중복 체크
        userRepository.findByEmail(email)
                .ifPresent(u -> {
                    throw new RuntimeException("이미 가입된 이메일입니다.");
                });

        // 랜덤 비밀번호 생성 (UUID) 후 인코딩
        String randomPassword = UUID.randomUUID().toString();
        String encodedPassword = passwordEncoder.encode(randomPassword);

        User user = User.builder()
                .email(email)
                .username(username)
                .userType(type)
                .password(encodedPassword)
                .build();

        return userRepository.save(user);
    }

    //주어진 ID로 유저를 조회하는 메서드
    public UserResponseDto getUserById(Long userId) {
        return userRepository.findById(userId)
                .filter(user -> !user.isDeleted()) // 논리 삭제된 사용자 제외
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .rating(user.getRating())
                        .userType(user.getUserType())
                        .build())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

    //로그인 기능: 이메일과 비밀번호로 사용자 인증
//    @Transactional(readOnly = true)
//    public UserResponseDto login(String email, String rawPassword) {
//        User user = userRepository.findByEmail(email)
//                .filter(u -> !u.isDeleted()) // 논리 삭제된 사용자 제외
//                .orElseThrow(() -> new RuntimeException("해당 이메일의 사용자가 없습니다."));
//
//        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
//            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
//        }
//
//        return UserResponseDto.builder()
//                .id(user.getId())
//                .username(user.getUsername())
//                .email(user.getEmail())
//                .phoneNumber(user.getPhoneNumber())
//                .rating(user.getRating())
//                .build();
//    }
    public User loginAndValidate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다."));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
        
        return user;
    }

    public User loginAndValidate(String email, String password, UserType requiredType) {
        User user = loginAndValidate(email, password);
        if (user.getUserType() != requiredType) {
            throw new IllegalArgumentException(requiredType + " 계정이 아닙니다.");
        }
        return user;
    }

    //유저 정보 수정(Update) 기능
    @Transactional
    public UserResponseDto updateUser(Long id, UserRequestDto dto) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        user.updateUserInfo(dto.getUsername(), dto.getPhoneNumber());        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .rating(user.getRating())
                .userType(user.getUserType())
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

    //인증번호 이메일로 보내기
    public void sendCodeToEmail(String email) {
        emailAuthManager.sendAuthCode(email);
    }

    //인증번호 검증하기
    public boolean verifyCode(String email, String code) {
        return emailAuthManager.verifyCode(email, code);
    }

    public void resetPasswordByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.changePassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        emailAuthManager.sendTemporaryPassword(email, tempPassword);
    }

    @Transactional
    public UserProfileResponseDto updateProfileImage(Long userId, String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("이미지 URL이 제공되지 않았습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        user.setImageUrl(imageUrl);  // 기존 이미지 덮어쓰기

        User savedUser = userRepository.save(user);
        return UserProfileResponseDto.fromEntity(savedUser);
    }

    // 전체 사용자 목록 조회 (관리자용)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.isDeleted()) // 논리 삭제된 사용자 제외
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .userType(user.getUserType())
                        .rating(user.getRating())
                        .build())
                .collect(Collectors.toList());
    }

    // 사용자 권한 변경 (관리자용)
    @Transactional
    public UserResponseDto updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        // ADMIN 역할은 변경 불가
        if (user.getUserType() == UserType.ADMIN) {
            throw new BusinessLogicException(ExceptionCode.CANNOT_MODIFY_ADMIN);
        }

        user.updateUserType(UserType.valueOf(role.toUpperCase()));
        
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .userType(user.getUserType())
                .rating(user.getRating())
                .build();
    }
}