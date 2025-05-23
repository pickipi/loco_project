package com.likelion.loco_project.domain.space.space.service;

import com.likelion.loco_project.domain.space.space.dto.SpaceListResponseDto;
import com.likelion.loco_project.domain.space.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpaceService {
    private final SpaceRepository spaceRepository;

    public List<SpaceListResponseDto> getAllSpaces() {
        return spaceRepository.findAll()
                .stream()
                .map(SpaceListResponseDto::from)
                .collect(Collectors.toList());
    }
}
