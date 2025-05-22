package com.likelion.loco_project.domain.space.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

// 검색 조건을 담을 DTO 클래스
@Getter
@Setter
public class SpaceSearchDto {
    private String location; // 위치
    private Integer minPrice; // 최소 가격
    private Integer maxPrice; // 최대 가격
    private Integer capacity; // 수용 인원
    private List<String> spaceTypes; // 공간 유형 (회의실, 스튜디오 등)
    private List<String> facilities; // 편의시설 (와이파이, 프로젝터 등)
    private String sortBy = "id"; // 정렬 기준
    private String sortDirection = "DESC"; // 정렬 방향
    private int page = 0;
    private int size = 10;
}