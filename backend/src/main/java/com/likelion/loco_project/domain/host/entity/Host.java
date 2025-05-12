package com.likelion.loco_project.domain.host.entity;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true) // toString() 시 BaseEntity 필드 포함
public class Host extends BaseEntity {
    // User 엔티티와의 1:1 관계 매핑
    // Host 테이블의 user_id 컬럼이 User 테이블의 id를 참조
    @OneToOne(fetch = FetchType.LAZY) // 1:1 관계, 지연 로딩 설정
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}