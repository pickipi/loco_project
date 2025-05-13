package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.domain.board.board.entity.BoardImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 게시글 이미지 정보를 클라이언트에 응답할 때 사용하는 DTO
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardImageResponseDto {
    // DTO는 BaseEntity를 상속받지 않음 = 별도 정의
    private Long id; // 이미지 ID
    private LocalDateTime createdDate; // 생성일자
    private LocalDateTime modifiedDate; // 수정일자

    private String filePath; // 이미지 파일 경로 또는 URL (S3 객체 키)
    private boolean isThumbnail; // 썸네일 여부

    // BoardImage 엔티티를 DTO로 변환하는 static from 메소드
    public static BoardImageResponseDto from(BoardImage boardImage) {
        return BoardImageResponseDto.builder()
                .id(boardImage.getId())
                .filePath(boardImage.getFilePath())
                .isThumbnail(boardImage.isThumbnail()) // boolean 필드의 getter는 isFieldName()
                .createdDate(boardImage.getCreatedDate())
                .modifiedDate(boardImage.getModifiedDate())
                .build();
    }
}