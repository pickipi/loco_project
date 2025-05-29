package com.likelion.loco_project.domain.host.service;

import com.likelion.loco_project.domain.host.dto.HostRequestDto;
import com.likelion.loco_project.domain.host.dto.HostResponseDto;
import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.entity.UserType;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.domain.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class HostService {

    private final HostRepository hostRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    // 호스트 등록 기능
    @Transactional
    public HostResponseDto registerHost(Long userId, HostRequestDto requestDto) {
        // 유저 조회 및 Host 엔티티 생성
        Host host = createHostEntity(userId, requestDto);

        // DB에 저장
        hostRepository.save(host);

        // 등록된 Host 정보를 DTO로 반환
        return new HostResponseDto(host);
    }

    // 유저 조회 및 Host 엔티티를 생성하는 private 메서드
    private Host createHostEntity(Long userId, HostRequestDto requestDto) {
        // 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        // Host 엔티티 생성 및 정보 세팅
        return Host.builder()
                .user(user)
                .isHost(true)
                .verified(requestDto.isVerified())
                .hostRating(0.0)
                .bankName(requestDto.getBankName())
                .accountNumber(requestDto.getAccountNumber())
                .accountUser(requestDto.getAccountUser())
                .registration(requestDto.getRegistration())
                .build();
    }

    // 호스트 정보 조회 기능
    @Transactional(readOnly = true)
    public HostResponseDto getHostInfo(Long userId) {
        // userId를 기반으로 Host 정보 조회
        Host host = hostRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("호스트 정보를 찾을 수 없습니다."));
        // 조회된 Host 정보를 DTO로 변환하여 반환
        return new HostResponseDto(host);
    }

    // 호스트 등록 기능 (UserRequestDto 사용)
    @Transactional
    public void registerHost(UserRequestDto dto) {
        User user = userRepository.save(
                User.builder()
                        .username(dto.getUsername())
                        .password(passwordEncoder.encode(dto.getPassword()))
                        .email(dto.getEmail())
                        .phoneNumber(dto.getPhoneNumber())
                        .userType(UserType.HOST) // typeHost -> userType으로 교체
                        .build()
        );

        Host host = Host.builder()
                .user(user)
                .bankName("")
                .accountNumber("")
                .accountUser("")
                .isHost(true)
                .verified(true)// verified true로 할껀지 아니면 false로 할껀지
                .build();

        hostRepository.save(host);
    }

    // 호스트인지의 여부
    @Transactional(readOnly = true)
    public boolean isHost(Long userId) {
        return hostRepository.findByUserId(userId).isPresent();
    }

    // 호스트 로그인 검증
    @Transactional(readOnly = true)
    public Host loginAndValidate(String email, String password) {
        User user = userService.loginAndValidate(email, password, UserType.HOST);
        return hostRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("호스트 정보를 찾을 수 없습니다."));
    }

    // 전체 호스트 조회 
    @Transactional(readOnly = true)
    public List<HostResponseDto> getAllHosts() {
        List<Host> hosts = hostRepository.findAll();
        return hosts.stream()
                .map(HostResponseDto::new)
                .collect(Collectors.toList());
    }
}
