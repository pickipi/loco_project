package com.likelion.loco_project.domain.payment.repository;

import com.likelion.loco_project.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // 게스트 ID로 결제 목록 조회
    List<Payment> findByGuestId(Long guestId);

    // 결제 상태로 조회
    List<Payment> findByPaymentStatus(String status);

    // 결제 실패 사유가 있는 경우만 조회
    List<Payment> findByPaymentFailedReasonIsNotNull();

    @Query("SELECT SUM(p.paymentAmount) FROM Payment p WHERE p.paymentStatus = :status")
    Long sumAllPayments(@Param("status") com.likelion.loco_project.domain.payment.entity.PaymentStatus status);
}
