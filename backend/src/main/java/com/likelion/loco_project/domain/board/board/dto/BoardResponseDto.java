package com.likelion.loco_project.domain.board.board.dto;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시판 요청 DTO (서버가 클라이언트로 데이터를 보낼때의 DTO)
 * ex. 게시글 생성/수정 완료, 단일 게시글 조회
 */
public class BoardResponseDto {
    private String title;
    private String description;
    private boolean isVisible; // 게시판 공개 여부
    private boolean report; // 신고 여부


}
