package com.likelion.loco_project.domain.notification.repository;

import com.likelion.loco_project.domain.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    //시간 내림차순
    List<Notification> findByReceiverIdOrderByCreatedDateDesc(Long receiverId);
    //알림 조회
    List<Notification> findByReceiverIdAndIsReadFalse(Long receiverId);
}
