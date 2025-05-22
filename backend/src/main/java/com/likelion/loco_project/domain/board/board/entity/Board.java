package com.likelion.loco_project.domain.board.board.entity;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

// 이 어노테이션 셋은 엔티티 생성마다 넣기
@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter@ToString
@Setter
public class Board extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING) // ENUN 타입을 String으로 DB에 저장
    @Column(nullable = false)
    private Category category;

    @Column(name = "is_visible", nullable = false)
    private Boolean isVisible; // 게시판 공개 여부, 공개/비공개 중 반드시 하나를 선택

    private Boolean report; // 신고 여부, null 허용이므로 boolean이 아닌 Boolean 사용

    // --- 관계 매핑 ---
    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "host_id", nullable = false) // 외래키 설정
    @OnDelete(action = OnDeleteAction.CASCADE) // 호스트 삭제 시 호스트가 작성한 게시글도 삭제
    private Host host;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "space_id", nullable = false) // 외래키 설정
    @OnDelete(action = OnDeleteAction.CASCADE) // 공간 삭제 시 공간이 등록되어있는 게시글도 삭제
    private Space space;
}
