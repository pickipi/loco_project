package com.likelion.loco_project.domain.board.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

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
    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String description;

    // 어떤 공간에 대한 게시글인지 나타내는 공간 ID, 객체가 아닌 ID 값만 가져옴
    @NotNull(message = "공간 ID는 필수입니다.")
    private Long spaceId;
}
