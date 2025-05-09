package com.likelion.loco_project.domain.board.board.dto;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시글 상세 응답 DTO
 * ex. BoardResponseDto보다 더 상세하게 해당 게시글과 관련된 정보를 포함 (ex. 댓글, 좋아요, 이미지 등)
 */
public class BoardDetailResponseDto {
    private String title;
    private String description;
    private boolean isVisible; // 게시판 공개 여부
    private boolean report; // 신고 여부
}
