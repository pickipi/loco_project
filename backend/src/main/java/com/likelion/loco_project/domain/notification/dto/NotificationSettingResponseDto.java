package com.likelion.loco_project.domain.notification.dto;

import com.likelion.loco_project.domain.notification.entity.UserNotificationSetting;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationSettingResponseDto {
    private boolean commentEnabled;
    private boolean reservationEnabled;
    private boolean chatEnabled;
    private boolean paymentEnabled;

    public static NotificationSettingResponseDto from(UserNotificationSetting setting) {
        return NotificationSettingResponseDto.builder()
                .commentEnabled(setting.isCommentEnabled())
                .reservationEnabled(setting.isReservationEnabled())
                .chatEnabled(setting.isChatEnabled())
                .paymentEnabled(setting.isPaymentEnabled())
                .build();
    }
}