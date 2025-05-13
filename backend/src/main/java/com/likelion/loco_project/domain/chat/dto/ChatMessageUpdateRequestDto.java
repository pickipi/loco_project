package com.likelion.loco_project.domain.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageUpdateRequestDto {

    @NotNull(message = "보낸 사람 ID는 필수입니다.")
    private Long senderId;

    @NotBlank(message = "메세지는 공백일 수 없습니다")
    private String message;
}