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
 * @description : 게시글 상세 응답 DTO
 * ex. BoardResponseDto보다 더 상세하게 해당 게시글과 관련된 정보를 포함 (ex. 댓글, 좋아요, 이미지 등)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDetailResponseDto {
    // DTO는 BaseEntity를 상속받지 않도록 BaseEntity로부터 가져온 필드
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    // 기본 출력되어야할 엔티티 정보
    private String title;
    private String description;
    private Category category; // Category Enum 타입 사용
    private boolean isVisible; // 게시판 공개 여부
    private Boolean report; // 신고 여부 (Null 허용 -> Boolean타입)

    // 연관된 엔티티 정보
    private Long spaceId;
    private String spaceName;
    private Long hostId;
    private String authorName;

    // BoardResponseDto + 추가된 필드
//     private List<CommentResponseDto> comments; // 댓글 목록
//     private List<SpaceImageResponseDto> images; // 이미지 목록

    public static BoardDetailResponseDto from(Board board, String authorName, String spaceName /*, List<CommentResponseDto> comments, List<SpaceImageResponseDto> images */) {
        return BoardDetailResponseDto.builder()
                // Board 엔티티는 BaseEntity를 상속받았으므로 BaseEntity 필드의 getter를 호출
                .id(board.getId())
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())

                .title(board.getTitle())
                .description(board.getDescription())
                .category(board.getCategory())
                .isVisible(board.getIsVisible())
                .report(board.getReport())

                // 연관 엔티티가 null일 경우를 대비한 null 체크 추가
                .spaceId(board.getSpace() != null ? board.getSpace().getId() : null)
                .spaceName(spaceName) // Service에서 조회하여 전달받은 공간 이름 사용
                .hostId(board.getHost() != null ? board.getHost().getId() : null)
                .authorName(authorName) // Service에서 조회하여 전달받은 작성자 이름 사용
                .build();
    }
}
