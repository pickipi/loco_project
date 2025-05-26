package com.likelion.loco_project.domain.notification.repository;

import com.likelion.loco_project.domain.notification.entity.UserNotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserNotificationSettingRepository extends JpaRepository<UserNotificationSetting, Long> {
    Optional<UserNotificationSetting> findByUserId(Long userId);
}