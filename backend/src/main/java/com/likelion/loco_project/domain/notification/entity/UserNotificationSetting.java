package com.likelion.loco_project.domain.notification.entity;

import com.likelion.loco_project.domain.user.entity.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class UserNotificationSetting {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    private User user;

    private boolean commentEnabled = true;
    private boolean reservationEnabled = true;
    private boolean chatEnabled = true;
    private boolean paymentEnabled = true;
}