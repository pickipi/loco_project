package com.likelion.loco_project.global.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DummyNotificationService implements NotificationService {
    @Override
    public void sendReservationConfirmedNotification(Long guestId, Long reservationId) {
        log.info("게스트 ID {}에게 예약 ID {} 확정 알림 전송", guestId, reservationId);
    }
}
