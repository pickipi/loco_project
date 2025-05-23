package com.likelion.loco_project.domain.report.entity;

import com.likelion.loco_project.domain.report.type.ReportType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신고 유형: BOARD, REVIEW 등
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    // 신고된 대상 ID (게시물 ID 또는 리뷰 ID)
    @Column(nullable = false)
    private Long reportedId;

    // 신고 사유
    @Column(length = 500)
    private String reason;

    // 신고자 (선택 사항)
    private Long reporterId;
}
