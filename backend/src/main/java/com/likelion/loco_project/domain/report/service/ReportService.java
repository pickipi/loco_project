package com.likelion.loco_project.domain.report.service;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guest.repository.GuestRepository;
import com.likelion.loco_project.domain.report.dto.ReportRequestDto;
import com.likelion.loco_project.domain.report.dto.ReportResponseDto;
import com.likelion.loco_project.domain.report.entity.Report;
import com.likelion.loco_project.domain.report.repository.ReportRepository;
import com.likelion.loco_project.domain.review.entity.Review;
import com.likelion.loco_project.domain.review.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final GuestRepository guestRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public ReportResponseDto reportReview(Long guestId, ReportRequestDto requestDto) {
        Guest reporter = guestRepository.findById(guestId)
                .orElseThrow(() -> new IllegalArgumentException("게스트가 존재하지 않습니다."));
        Review review = reviewRepository.findById(requestDto.getReviewId())
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));

        // 임시로 리턴 null 처리했습니다. for further editing.
//        Report report = Report.builder()
//                .reporter(reporter)
//                .review(review)
//                .reason(requestDto.getReason())
//                .detail(requestDto.getDetail())
//                .build();

//        reportRepository.save(report);
//        return new ReportResponseDto(report.getId(), "신고가 접수되었습니다.");
        return null;
    }
}
