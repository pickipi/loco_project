package com.likelion.loco_project.domain.user.entity;

import com.likelion.loco_project.domain.space.entity.Space;
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
@Setter
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;  //UserType typeHost 썼던것 userType으로 변경하기

    @Column
    @Comment("평점")
    private Double rating;

    @Column
    @Comment("이미지")
    private String imageUrl; //이미지

    // 유저 삭제를 물리삭제가 아닌 논리삭제로 변경하는데에 필요한 엔티티
    @Column(name = "is_deleted", nullable = false)
    @Comment("삭제 여부")
    @Builder.Default
    private boolean isDeleted = false;

    // 논리 삭제 메서드
    public void delete() {
        this.isDeleted = true;
    }

    // 유저가 탈퇴요청을 완료했으면 true
    public boolean isDeleted() {
        return isDeleted;
    }

    //User 수정 메서드
    public void updateUserInfo(String username, String phoneNumber) {
        if (username != null) this.username = username;
        if (phoneNumber != null) this.phoneNumber = phoneNumber;
    }

    // 알림 수신 여부 (기본값: true)
    @Column(nullable = false)
    @Builder.Default
    private boolean notificationEnabled = true;

    //찜하기
    @ManyToMany
    @JoinTable(
            name = "user_favorite_spaces",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "space_id")
    )
    @Builder.Default
    private Set<Space> favoriteSpaces = new HashSet<>();


    // 비밀번호 변경 메서드
    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    // 사용자 권한 변경 메서드
    public void updateUserType(UserType newType) {
        if (this.userType == UserType.ADMIN) {
            throw new IllegalStateException("관리자의 권한은 변경할 수 없습니다.");
        }
        this.userType = newType;
    }
}