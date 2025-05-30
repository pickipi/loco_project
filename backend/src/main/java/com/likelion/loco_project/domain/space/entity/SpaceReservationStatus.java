package com.likelion.loco_project.domain.space.entity;

public enum SpaceReservationStatus {
    PENDING,       // 대기 중
    CONFIRMED,     // 확정됨
    REJECTED,      // 거절됨
    CANCELLED      // 게스트 또는 시스템에 의한 취소
}
