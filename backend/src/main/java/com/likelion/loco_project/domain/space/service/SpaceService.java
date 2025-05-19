package com.likelion.loco_project.domain.space.service;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.space.dto.SpaceCreateRequestDto;
import com.likelion.loco_project.domain.space.dto.SpaceResponseDto;
import com.likelion.loco_project.domain.space.dto.SpaceUpdateRequestDto;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final HostRepository hostRepository;

    // 공간 생성
    public SpaceResponseDto createSpace(Long hostId, SpaceCreateRequestDto dto) {
        Host host = hostRepository.findById(hostId)
                .orElseThrow(() -> new IllegalArgumentException("호스트를 찾을 수 없습니다."));
        Space space = spaceRepository.save(dto.toEntity(host));
        return SpaceResponseDto.fromEntity(space);
    }

    // 공간 단일 조회
    public SpaceResponseDto getSpace(Long id) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공간입니다."));
        return SpaceResponseDto.fromEntity(space);
    }

    // 공간 전체 조회
    public List<SpaceResponseDto> getAllSpaces() {
        return spaceRepository.findAll().stream()
                .map(SpaceResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 공간 수정
    @Transactional
    public SpaceResponseDto updateSpace(Long id, SpaceUpdateRequestDto dto) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공간입니다."));
        dto.applyTo(space);  // DTO -> 기존 엔티티에 반영
        return SpaceResponseDto.fromEntity(space);
    }

    // 공간 삭제
    public void deleteSpace(Long id) {
        if (!spaceRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 공간입니다.");
        }
        spaceRepository.deleteById(id);
    }
}