package com.likelion.loco_project.domain.notification.service;

import com.likelion.loco_project.domain.notification.dto.NotificationSettingResponseDto;
import com.likelion.loco_project.domain.notification.entity.UserNotificationSetting;
import com.likelion.loco_project.domain.notification.repository.UserNotificationSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class NotificationSettingService {
    private final UserNotificationSettingRepository repository;

    public NotificationSettingResponseDto getSettingsForUser(Long userId) {
        UserNotificationSetting setting = repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("설정이 존재하지 않습니다."));
        return NotificationSettingResponseDto.from(setting);
    }
}