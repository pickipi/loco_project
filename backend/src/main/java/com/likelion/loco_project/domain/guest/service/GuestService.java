package com.likelion.loco_project.domain.guest.service;

import com.likelion.loco_project.domain.guest.dto.GuestRequestDto;
import com.likelion.loco_project.domain.guest.dto.GuestResponseDto;
import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class GuestService {
    private final GuestRepository guestRepository;
    private final UserRepository userRepository;

    // 게스트 등록 기능
    @Transactional
    public GuestResponseDto createGuest(GuestRequestDto dto) {
        // 유저 조회 및 Guest 엔티티 생성
        Guest guest = createGuestEntity(dto);

        // DB에 게스트 정보 저장
        Guest saved = guestRepository.save(guest);
        return toDto(saved);
    }

    // 유저 조회 및 Guest 엔티티를 생성하는 private 메서드
    private Guest createGuestEntity(GuestRequestDto dto) {
        // 유저 조회
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // Guest 엔티티 생성 및 정보 세팅
        return Guest.builder()
                .user(user)
                .guestRating(BigDecimal.ZERO)
                .build();
    }

    // 특정 게스트 정보 조회 기능
    @Transactional(readOnly = true)
    public GuestResponseDto getGuest(Long id) {
        // 게스트 조회
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게스트를 찾을 수 없습니다."));
        // 조회된 게스트 정보를 DTO로 반환
        return toDto(guest);
    }

    // Guest 엔티티를 GuestResponseDto로 변환하는 메서드
    private GuestResponseDto toDto(Guest guest) {
        return GuestResponseDto.builder()
                .id(guest.getId())
                .guestRating(guest.getGuestRating())
                .userId(guest.getUser().getId())
                .userName(guest.getUser().getUsername())
                .build();
    }
}
