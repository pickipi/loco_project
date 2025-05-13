package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.domain.board.board.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*
    * @author : pickipi
    * @date : 2025/05/09
    * @description : 게시판 요청 DTO (클라이언트가 서버로 데이터를 보낼때의 DTO)
    * ex. 게시글 생성, 수정 요청
 */
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequestDto {
    // DTO는 BaseEntity를 상속받지 않도록 BaseEntity로부터 가져온 필드
    private Long id;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String description;

    @NotNull(message = "카테고리는 필수입니다.")
    private Category category; // Category Enum 타입 필드

    // 어떤 공간에 대한 게시글인지 나타내는 공간 ID, 객체가 아닌 ID 값만 가져옴
    @NotNull(message = "공간 ID는 필수입니다.")
    private Long spaceId;

    // // 게시판 공개 여부 (클라이언트가 설정 가능) -> 클라이언트가 공개 여부를 반드시 바꿀 필요가 없으므로 Boolean 타입으로 설정 (null 허용)
    private Boolean isVisible;
}
