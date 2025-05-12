package com.likelion.loco_project.domain.user.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Comment;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users") //user는 DB 예약어일 수 있음
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위한 protected 기본 생성자
@Getter
@ToString
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("유저 ID") // 실제 DB에 컬럼 주석 생성 (MySQL에서 보이게)
    private Long id;

    @Column(nullable = false, length = 20)
    @Comment("이름")
    private String username;

    @Column(nullable = false, length = 255)
    @Comment("비밀번호")
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    @Comment("이메일")
    private String email;

    @Column(nullable = false, unique = true, length = 30)
    @Comment("전화번호")
    private String phoneNumber;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserType> roles = new HashSet<>();

    @Column
    @Comment("평점")
    private Double rating;
}
