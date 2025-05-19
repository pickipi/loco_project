package com.likelion.loco_project.domain.host.dto;

import com.likelion.loco_project.domain.host.entity.Host;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class HostResponseDto {
    private final Long id; // 호스트 ID
    private final boolean verified; // 인증 여부
    private final Double hostRating; // 호스트 평점
    private final String bankName; // 은행 이름
    private final String accountNumber; // 계좌 번호
    private final String accountUser; // 예금주 이름
    private final LocalDateTime registration; // 호스트로 등록일

    // Host 엔티티를 받아 DTO 필드에 매핑
    public HostResponseDto(Host host) {
        this.id = host.getId();
        this.verified = host.isVerified();
        this.hostRating = host.getHostRating();
        this.bankName = host.getBankName();
        this.accountNumber = host.getAccountNumber();
        this.accountUser = host.getAccountUser();
        this.registration = host.getRegistration();
    }
}