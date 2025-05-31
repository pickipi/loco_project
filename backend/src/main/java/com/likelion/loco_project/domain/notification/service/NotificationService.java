package com.likelion.loco_project.domain.notification.service;

import com.likelion.loco_project.domain.notification.dto.NotificationResponseDto;
import com.likelion.loco_project.domain.notification.dto.NotificationSettingResponseDto;
import com.likelion.loco_project.domain.notification.entity.Notification;
import com.likelion.loco_project.domain.notification.entity.NotificationType;
import com.likelion.loco_project.domain.notification.entity.UserNotificationSetting;
import com.likelion.loco_project.domain.notification.repository.NotificationRepository;
import com.likelion.loco_project.domain.reservation.entity.Reservation;
import com.likelion.loco_project.domain.reservation.entity.ReservationStatus;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService {

    // 알림 정보를 저장하고 조회하기 위한 Repository
    private final NotificationRepository notificationRepository;
    // WebSocket을 통해 클라이언트에게 실시간 알림을 보내는 데 사용하는 템플릿
    private final SimpMessagingTemplate messagingTemplate;

    private final UserRepository userRepository;

    //특정 사용자에게 알림을 생성하고 WebSocket을 통해 실시간 전송
    public void notifyUser(Long receiverId, String content, NotificationType type) {
        User user = userRepository.findById(receiverId).orElseThrow();

        // 알림 꺼둔 유저는 패스
        if (!user.isNotificationEnabled()) return;

        Notification notification = Notification.builder()
                .receiverId(receiverId)
                .content(content)
                .type(type)
                .isRead(false)
                .createdDate(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        NotificationResponseDto dto = NotificationResponseDto.fromEntity(notification);
        messagingTemplate.convertAndSend("/topic/notifications/" + receiverId, dto);
    }

    //특정 사용자의 모든 알림 목록 조회 (최신순 정렬)
    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotificationsForUser(Long userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedDateDesc(userId)
                .stream()
                .map(NotificationResponseDto::fromEntity)
                .toList();
    }

    //특정 알림을 읽음 처리
    @Transactional
    public void markAsRead(Long id) {
        Notification noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));
        noti.markAsRead();
    }

    //특정 사용자의 모든 읽지 않은 알림을 읽음 처리
    @Transactional
    public void markAllAsRead(Long receiverId) {
        List<Notification> notis = notificationRepository.findByReceiverIdAndIsReadFalse(receiverId);
        notis.forEach(Notification::markAsRead);
    }

    //특정 알림 삭제 (본인 알림만 삭제 가능)
    @Transactional
    public void deleteNotification(Long id, Long userId) {
        Notification noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("알림을 찾을 수 없습니다."));

        if (!noti.getReceiverId().equals(userId)) {
            throw new AccessDeniedException("삭제 권한이 없습니다.");
        }

        notificationRepository.delete(noti);
    }

    // 게스트가 예약했을 때 → 호스트에게 알림
    public void notifyReservationCreated(User host, User guest, Space space) {
        if (host == null || guest == null || space == null) return;

        String message = String.format(
                "[%s]님이 공간 [%s]을 예약했습니다.",
                guest.getUsername(),
                space.getSpaceName()
        );

        notifyUser(host.getId(), message, NotificationType.RESERVATION);
    }

    // 호스트가 예약 상태 변경했을 때 → 게스트에게 알림
    public void notifyReservationUpdated(User guest, Reservation reservation) {
        if (guest == null || reservation == null) return;

        String statusMessage = getReservationStatusMessage(reservation.getStatus());

        String message = String.format(
                "예약하신 공간 [%s]의 상태가 '%s'으로 변경되었습니다.",
                reservation.getSpace().getSpaceName(),
                statusMessage
        );

        notifyUser(guest.getId(), message, NotificationType.RESERVATION_STATUS);
    }

    // 예약 상태 enum을 사용자 친화적 메시지로 변환
    private String getReservationStatusMessage(Reservation.ReservationStatus status) {
        return switch (status) {
            case PENDING -> "대기 중";
            case CONFIRMED -> "확정됨";
            case CANCELLED -> "취소됨";
            default -> "알 수 없음"; // 정의되지 않은 상태 처리
        };
    }

    // 댓글 알림
    public void notifyCommentReply(User replier, User parentAuthor, User host, User guest, boolean isReply, User postAuthor) {

        if (replier == null || parentAuthor == null || host == null
                || guest == null || postAuthor == null)
            return;

        String message = String.format("[%s]님이 댓글을 남겼습니다.", replier.getUsername());


        // 1. 부모 댓글 작성자에게 알림 (본인이 본인 댓글에 단 건 제외)
        if (!replier.equals(parentAuthor)) {
            notifyUser(parentAuthor.getId(), message, NotificationType.COMMENT);
        }

        // 2. 호스트가 게시글 작성자이면서 댓글 작성자가 아닐 때만 알림
        if (host.equals(postAuthor) && !replier.equals(host)) {
            notifyUser(host.getId(), message, NotificationType.COMMENT);
        }

        // 3. 게스트는 대댓글일 때만 알림 (작성자가 본인이 아니어야 함)
        if (isReply && !replier.equals(guest)) {
            notifyUser(guest.getId(), message, NotificationType.COMMENT);
        }
    }
}