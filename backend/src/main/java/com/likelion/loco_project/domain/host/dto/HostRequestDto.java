package com.likelion.loco_project.domain.host.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class HostRequestDto {
    private boolean verified; // 호스트 인증 여부
    private String bankName; // 은행 이름
    private String accountNumber; // 계좌 번호
    private String accountUser; // 예금주 이름
    private LocalDateTime registration; // 호스트로 등록된 시간
}
