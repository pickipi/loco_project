package com.likelion.loco_project.domain.space.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;

@Entity
@Getter
public class Space extends BaseEntity {
    @Column(name = "space_name", nullable = false, length = 100)
    private String spaceName;
}
