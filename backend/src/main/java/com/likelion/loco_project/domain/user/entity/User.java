package com.likelion.loco_project.domain.user.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class User extends BaseEntity {
    private String name;
    private String password;
    private String email;
    private String phoneNumber;
    private String name;
}
