package com.likelion.loco_project.domain.guestRating.service;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.guestRating.dto.GuestRatingRequestDto;
import com.likelion.loco_project.domain.guestRating.dto.GuestRatingResponseDto;
import com.likelion.loco_project.domain.guestRating.entity.GuestRating;
import com.likelion.loco_project.domain.guestRating.repository.GuestRatingRepository;
import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class GuestRatingService {

    private final GuestRepository guestRepository;
    private final HostRepository hostRepository;
    private final GuestRatingRepository guestRatingRepository;

    @Transactional
    public GuestRatingResponseDto rateGuest(Long hostId, GuestRatingRequestDto dto) {
        Host host = hostRepository.findById(hostId)
                .orElseThrow(() -> new IllegalArgumentException("호스트가 존재하지 않습니다."));
        Guest guest = guestRepository.findById(dto.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("게스트가 존재하지 않습니다."));

        // 이미 평가한 기록이 있으면 수정, 없으면 생성
        GuestRating rating = guestRatingRepository.findByHostAndGuest(host, guest)
                .map(r -> {
                    r.updateRating(dto.getRating());
                    return r;
                })
                .orElse(GuestRating.builder()
                        .host(host)
                        .guest(guest)
                        .rating(dto.getRating())
                        .build());

        guestRatingRepository.save(rating);
        return new GuestRatingResponseDto(rating.getId(), "평가가 완료되었습니다.");
    }

    //평균 평점
    public BigDecimal getAverageRatingForGuest(Long guestId) {
        Double avgScore = guestRatingRepository.findAverageScoreByGuestId(guestId);

        if (avgScore == null) {
            return BigDecimal.ZERO;
        }

        return BigDecimal.valueOf(avgScore).setScale(1, RoundingMode.HALF_UP);
    }
}
