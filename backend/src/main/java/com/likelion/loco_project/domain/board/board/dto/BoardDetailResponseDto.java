package com.likelion.loco_project.domain.board.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시글 상세 응답 DTO
 * ex. BoardResponseDto보다 더 상세하게 해당 게시글과 관련된 정보를 포함 (ex. 댓글, 좋아요, 이미지 등)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardDetailResponseDto {
    // DTO는 BaseEntity를 상속받지 않도록 BaseEntity로부터 가져온 필드
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

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

    // BoardResponseDto + 추가된 필드
//     private List<CommentResponseDto> comments; // 댓글 목록
//     private List<SpaceImageResponseDto> images; // 이미지 목록
}
