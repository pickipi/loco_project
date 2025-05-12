package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.global.jpa.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시판 요청 DTO (서버가 클라이언트로 데이터를 보낼때의 DTO)
 * ex. 게시글 생성/수정 완료, 단일 게시글 조회 (= 게시글의 상세정보 조회)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponseDto extends BaseEntity {
    // 기본 출력되어야할 엔티티 정보
    private String title;
    private String description;
    private Boolean isVisible; // 게시판 공개 여부 (Null 허용 -> Boolean타입)
    private Boolean report; // 신고 여부 (Null 허용 -> Boolean타입)

    // 연관된 엔티티 정보
    private Long spaceId;
    private String spaceName;
    private Long hostId;
    private String authorName;
}
