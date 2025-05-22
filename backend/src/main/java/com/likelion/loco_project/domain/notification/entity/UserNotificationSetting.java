package com.likelion.loco_project.domain.notification.entity;

import com.likelion.loco_project.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class UserNotificationSetting {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private boolean commentEnabled = true;
    private boolean reservationEnabled = true;
    private boolean chatEnabled = true;
    private boolean paymentEnabled = true;
}