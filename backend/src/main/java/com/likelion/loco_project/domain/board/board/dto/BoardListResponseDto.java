package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.domain.board.board.entity.Category;
import com.likelion.loco_project.global.jpa.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시판 목록 응답 DTO
 * ex. 게시글 목록 화면에서 간략히 보여줄 정보만 담아냄
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardListResponseDto extends BaseEntity {
    private String title;
    private Boolean isVisible; // 게시판 공개 여부 (Null 허용 -> Boolean타입)
    private Boolean report; // 신고 여부 (Null 허용 -> Boolean타입)
    private Category category;

    // 연관된 엔티티 정보
    private String authorName; // 호스트 이름/닉네임
    private String spaceName; // 공간 이름

    // TODO: 썸네일 이미지, 댓글 수, 좋아요 수 등 추가
}
