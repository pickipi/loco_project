package com.likelion.loco_project.domain.board.post.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

// 이 어노테이션 셋은 엔티티 생성마다 넣기
@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter@ToString
public class Post extends BaseEntity {
    private String title;
    private String content;
}
