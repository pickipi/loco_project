package com.likelion.loco_project.domain.space.service;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.space.dto.*;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.entity.SpaceStatus;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

        // DTO를 Entity로 변환
        Space space = dto.toEntity(host);

        // 이미지 URL 목록 중 첫 번째 URL을 imageId 필드에 임시 저장 (Long 타입과 맞지 않으므로 실제 이미지 ID 또는 URL 저장 필드 필요)
        // 여기서는 임시로 imageId 필드를 0으로 설정하고, 이미지 URL 처리는 추후 개선 필요
        // 실제 이미지 URL을 저장하려면 Space 엔티티에 String 타입의 이미지 URL 필드 추가 필요
        // space.setImageId(...);

        Space savedSpace = spaceRepository.save(space);
        return SpaceResponseDto.fromEntity(savedSpace);
    }

    // 공간 단일 조회
    public SpaceResponseDto getSpace(Long id) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공간입니다."));
        return SpaceResponseDto.fromEntity(space);
    }

    // 모든 공간 목록 조회
    public List<SpaceListResponseDto> getAllSpaces() {
        List<Space> spaces = spaceRepository.findAll();
        return spaces.stream()
                .map(SpaceListResponseDto::from)
                .collect(Collectors.toList());
    }

    // 모든 공간 목록 조회 (페이징 처리)
    public Page<SpaceListResponseDto> getAllSpacesWithPagination(Pageable pageable) {
        Page<Space> spacePage = spaceRepository.findAll(pageable);
        return spacePage.map(SpaceListResponseDto::from);
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

    // 공간 검색 기능
    public Page<SpaceResponseDto> searchSpaces(SpaceSearchDto searchDto) {
        // Specification 생성
        Specification<Space> spec = Specification.where(null);

        if (searchDto.getLocation() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.like(root.get("address"), "%" + searchDto.getLocation() + "%"));
        }

        if (searchDto.getMinPrice() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("pricePerHour"), searchDto.getMinPrice()));
        }

        // 나머지 검색 조건들에 대한 Specification 추가...

        // 정렬 조건 설정
        Sort sort = Sort.by(
                searchDto.getSortDirection().equals("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC,
                searchDto.getSortBy()
        );

        // 페이지네이션 설정
        PageRequest pageRequest = PageRequest.of(
                searchDto.getPage(),
                searchDto.getSize(),
                sort
        );

        // 검색 결과 반환
        return spaceRepository.findAll(spec, pageRequest)
                .map(SpaceResponseDto::fromEntity); // 이미 구현되어있는 fromEntity 메서드 사용하여 DTO로 변환
    }

    // # 관리자 기능 부분
    
    // 공간 승인
    @Transactional
    public void approveSpace(Long id) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ID " + id + "에 해당하는 공간을 찾을 수 없습니다."));

        if (space.getStatus() != SpaceStatus.PENDING) {
            throw new IllegalArgumentException("ID " + id + " 공간은 승인 대기 상태가 아닙니다. (현재 상태: " + space.getStatus() + ")");
        }

        space.setStatus(SpaceStatus.APPROVED);
    }

    // 공간 반려
    @Transactional
    public void rejectSpace(Long id, String rejectionReason) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ID " + id + "에 해당하는 공간을 찾을 수 없습니다."));

        if (space.getStatus() != SpaceStatus.PENDING) {
            throw new IllegalArgumentException("ID " + id + " 공간은 승인 대기 상태가 아닙니다. (현재 상태: " + space.getStatus() + ")");
        }

        space.setStatus(SpaceStatus.REJECTED);
        space.setRejectionReason(rejectionReason); // 반려 사유 저장
    }
}
