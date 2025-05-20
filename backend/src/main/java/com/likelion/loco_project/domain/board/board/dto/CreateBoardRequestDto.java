package com.likelion.loco_project.domain.board.board.dto;

import com.likelion.loco_project.domain.board.board.entity.Category;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateBoardRequestDto {
    private String title;
    private String description;
    private Category category;
    private Long spaceId;
    private Boolean isVisible;
    private MultipartFile thumbnailFile;
    private List<MultipartFile> otherImageFiles;
}