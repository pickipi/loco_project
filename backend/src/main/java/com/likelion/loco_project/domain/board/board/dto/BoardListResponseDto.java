package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시판 목록 응답 DTO
 * ex. 게시글 목록 화면에서 간략히 보여줄 정보만 담아냄
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardListResponseDto {
    // DTO는 BaseEntity를 상속받지 않도록 BaseEntity로부터 가져온 필드
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    // BaseEntity에 해당하지 않는 필드들
    private String title;
    private Category category;

    // 연관된 엔티티 정보
    private String authorName; // 호스트 이름/닉네임
    private String spaceName; // 공간 이름

    // Entity에서 DTO로 변환
    // Service로부터 Board 엔티티 관련 연관 정보를 받아서 DTO를 생성
    public static BoardListResponseDto from(Board board, String authorName, String spaceName) {
        return BoardListResponseDto.builder()
                .id(board.getId())
                .title(board.getTitle())
                .category(board.getCategory())
                .createdDate(board.getCreatedDate())
                .authorName(authorName)
                .spaceName(spaceName)
                .build();
    }

    // TODO: 썸네일 이미지, 댓글 수, 좋아요 수 등 추가
}
