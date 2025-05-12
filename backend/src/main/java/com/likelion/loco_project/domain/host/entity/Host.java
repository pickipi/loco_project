package com.likelion.loco_project.domain.host.entity;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Host extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}