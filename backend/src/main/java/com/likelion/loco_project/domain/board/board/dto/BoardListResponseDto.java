package com.likelion.loco_project.domain.board.board.dto;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시판 목록 응답 DTO
 * ex. 게시글 목록 화면에서 간략히 보여줄 정보만 담아냄
 */
public class BoardListResponseDto {
    private String title;
    private String description;
    private boolean isVisible; // 게시판 공개 여부
    private boolean report; // 신고 여부

}
