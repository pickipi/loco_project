package com.likelion.loco_project.domain.board.board.entity;

import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

// 게시글에 첨부되는 이미지 정보를 저장하는 엔티티
@Entity
@Table(name = "board_images") // 테이블 이름 지정
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위한 protected 기본 생성자
@Getter
@Setter // 이미지 정보 변경 (ex. 썸네일 변경) 시 필요
@ToString(callSuper = true) // BaseEntity 필드 포함
public class BoardImage extends BaseEntity {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("이미지 ID")
    private Long id;

    @Column(nullable = false)
    @Comment("이미지 파일 경로 또는 URL (S3 객체 키)")
    private String filePath;

    @Column(nullable = false)
    @Comment("게시글 대표 이미지(썸네일) 여부")
    private boolean isThumbnail;

    // --- 관계 매핑 ---
    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "board_id", nullable = false) // 외래키 컬럼 이름 지정
    @OnDelete(action = OnDeleteAction.CASCADE) // 게시글 삭제 시 연관된 이미지도 함께 삭제
    @Comment("게시글 ID (FK)")
    private Board board; // 이 이미지가 속한 게시글 엔티티
}