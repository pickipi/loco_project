package com.likelion.loco_project.global.notification;

import org.springframework.stereotype.Service;

@Service
public class DefaultNotificationService implements NotificationService {

    @Override
    public void sendReservationConfirmedNotification(Long guestId, Long reservationId) {
        sendEmail(guestId, "예약 확정", "예약 ID " + reservationId + "가 확정되었습니다.");
    }

    @Override
    public void sendReservationRejectedNotification(Long guestId, Long reservationId) {
        sendEmail(guestId, "예약 거절", "예약 ID " + reservationId + "가 거절되었습니다.");
    }

    @Override
    public void sendEmail(Long guestId, String subject, String message) {
        // 이메일 전송 로직 (예: SMTP 연동 또는 외부 API)
        System.out.println("[이메일] " + guestId + " | " + subject + " | " + message);
    }

    @Override
    public void sendPush(Long guestId, String title, String message) {
        // 푸시 알림 로직 (예: Firebase 연동)
        System.out.println("[푸시] " + guestId + " | " + title + " | " + message);
    }
}
