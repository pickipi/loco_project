package com.likelion.loco_project.global.notification;

public interface NotificationService {
    void sendReservationConfirmedNotification(Long guestId, Long reservationId);
    void sendReservationRejectedNotification(Long guestId, Long reservationId);
    void sendEmail(Long guestId, String subject, String message);
    void sendPush(Long guestId, String title, String message);
}
