package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.domain.board.board.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/*
 * @author : pickipi
 * @date : 2025/05/09
 * @description : 게시판 요청 DTO (서버가 클라이언트로 데이터를 보낼때의 DTO)
 * ex. 게시글 생성/수정 완료, 단일 게시글 조회 (= 게시글의 상세정보 조회)
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardResponseDto {
    // DTO는 BaseEntity를 상속받지 않도록 BaseEntity로부터 가져온 필드
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    // 기본 출력되어야할 엔티티 정보
    private String title;
    private String description;
    private boolean isVisible; // 게시판 공개 여부
    private Boolean report; // 신고 여부 (Null 허용 -> Boolean타입)

    // 연관된 엔티티 정보
    private Long spaceId;
    private String spaceName;
    private Long hostId;
    private String authorName;

    // 이미지 목록 필드 추가
    private List<BoardImageResponseDto> images;


    // Entity에서 DTO로 변환하는 static from 메소드 구현
    // 1-1. 이미지가 포함된 from 메소드
    public static BoardResponseDto from(Board board, String authorName, String spaceName, List<BoardImageResponseDto> images) {
        return BoardResponseDto.builder()
                .id(board.getId()) // BaseEntity 필드 설정
                .createdDate(board.getCreatedDate()) // BaseEntity 필드 설정
                .modifiedDate(board.getModifiedDate()) // BaseEntity 필드 설정
                .title(board.getTitle())
                .description(board.getDescription())
                .report(board.getReport())
                // 연관 엔티티가 null일 경우를 대비한 null 체크 추가
                .spaceId(board.getSpace() != null ? board.getSpace().getId() : null)
                .spaceName(spaceName) // Service에서 받아온 공간 이름 사용
                .hostId(board.getHost() != null ? board.getHost().getId() : null) // 연관 엔티티에서 ID 가져옴
                .authorName(authorName) // Service에서 받아온 작성자 이름 사용
                .images(images) // ⭐ 이미지 목록 설정
                .build();
    }

    // 1-2. 이미지가 없는 from 메소드 = 이미지 없이 Board 엔티티만 받는 경우
    public static BoardResponseDto from(Board board, String authorName, String spaceName) {
        return BoardResponseDto.builder()
                .id(board.getId())
                .createdDate(board.getCreatedDate())
                .modifiedDate(board.getModifiedDate())
                .title(board.getTitle())
                .description(board.getDescription())
                .isVisible(board.getIsVisible())
                .report(board.getReport())
                .spaceId(board.getSpace() != null ? board.getSpace().getId() : null)
                .spaceName(spaceName)
                .hostId(board.getHost() != null ? board.getHost().getId() : null)
                .authorName(authorName)
                .images(null) // 이미지 목록은 null 또는 빈 리스트로 설정
                .build();
    }
}
