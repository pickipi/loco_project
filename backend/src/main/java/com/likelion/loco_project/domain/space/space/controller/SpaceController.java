package com.likelion.loco_project.domain.space.space.controller;

import com.likelion.loco_project.domain.space.space.dto.SpaceListResponseDto;
import com.likelion.loco_project.domain.space.space.service.SpaceService;
import com.likelion.loco_project.global.common.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/spaces")
public class SpaceController {
    private final SpaceService spaceService;

    @GetMapping("/all")
    public RsData<List<SpaceListResponseDto>> getAllSpaces() {
        List<SpaceListResponseDto> spaces = spaceService.getAllSpaces();
        return RsData.of("S-1", "모든 공간 목록을 조회했습니다.", spaces);
    }
}
