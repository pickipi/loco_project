package com.likelion.loco_project.domain.space.service;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.space.dto.*;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.entity.SpaceStatus;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final Logger logger = LoggerFactory.getLogger(SpaceService.class);
    private final UserRepository userRepository;

    // 공간 등록
    @Transactional
    public SpaceResponseDto createSpace(Long hostId, SpaceCreateRequestDto dto) {
        try {
            logger.info("공간 등록 시작. Host ID: {}", hostId);
            logger.debug("받은 DTO 데이터: {}", dto);

            // 인증된 사용자의 ID (hostId로 넘어옴)를 사용하여 User 엔티티를 찾습니다.
            User user = userRepository.findById(hostId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + hostId));

            // 해당 User 엔티티와 연결된 Host 엔티티를 찾습니다.
            Host host = hostRepository.findByUser(user)
                     .orElseThrow(() -> new IllegalArgumentException("호스트를 찾을 수 없습니다. User ID: " + hostId));

            logger.debug("호스트 찾음: {}", host.getId());

            // 이미지 URL 유효성 검사 수정
            if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
                logger.debug("이미지 URL 확인: {}", dto.getImageUrls());
                validateImageUrls(dto.getImageUrls());
            }

            // DTO를 Entity로 변환
            Space space = dto.toEntity(host);
            logger.debug("생성된 Space 엔티티: {}", space);

            // DB 저장
            Space savedSpace = spaceRepository.save(space);
            logger.info("공간 등록 성공. Space ID: {}", savedSpace.getId());  // getId 메서드 호출 수정

            return SpaceResponseDto.fromEntity(savedSpace);
        } catch (Exception e) {
            logger.error("공간 등록 실패. Host ID: {}, 에러: {}", hostId, e.getMessage(), e);
            throw new RuntimeException("공간 등록 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    private void validateImageUrls(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            logger.warn("이미지 URL이 제공되지 않음");
            return; // 이미지가 필수가 아닌 경우 처리
        }

        for (String imageUrl : imageUrls) {
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                logger.warn("빈 이미지 URL 발견");
                continue;
            }
            // 이미지 URL 패턴 체크 제거 (placeholder 이미지도 허용)
            logger.debug("유효한 이미지 URL: {}", imageUrl);
        }
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
    @Transactional(readOnly = true)
    public Page<SpaceListResponseDto> getAllSpacesWithPagination(Pageable pageable) {
        return spaceRepository.findAll(pageable)
                .map(SpaceListResponseDto::from);   // 여기서 additionalImageUrls까지 읽어서 DTO에 담음
    }
//    public Page<Space> getAllSpacesWithPagination(Pageable pageable) {
//        return spaceRepository.findAll(pageable);
//    }

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

    @Transactional
    public SpaceResponseDto addSpaceImages(Long id, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            throw new IllegalArgumentException("이미지 URL이 제공되지 않았습니다.");
        }

        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 공간입니다."));

        // 첫 번째 이미지가 없는 경우에만 대표 이미지로 설정
        if (space.getImageUrl() == null && !imageUrls.isEmpty()) {
            space.setImageUrl(imageUrls.get(0));
            if (imageUrls.size() > 1) {
                space.getAdditionalImageUrls().addAll(imageUrls.subList(1, imageUrls.size()));
            }
        } else {
            // 이미 대표 이미지가 있는 경우 모든 이미지를 추가 이미지로 등록
            space.getAdditionalImageUrls().addAll(imageUrls);
        }

        Space savedSpace = spaceRepository.save(space);
        return SpaceResponseDto.fromEntity(savedSpace);
    }

    //찜 추가
    public void favoriteSpace(Long userId, Long spaceId) {
        User user = userRepository.findById(userId).orElseThrow();
        Space space = spaceRepository.findById(spaceId).orElseThrow();
        user.getFavoriteSpaces().add(space);
        userRepository.save(user);
    }

    // 찜 제거
    public void unfavoriteSpace(Long userId, Long spaceId) {
        User user = userRepository.findById(userId).orElseThrow();
        Space space = spaceRepository.findById(spaceId).orElseThrow();
        user.getFavoriteSpaces().remove(space);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<SpaceResponseDto> getSpacesByHostId(Long hostId, Pageable pageable) {
        
        try {
            // hostId가 실제로는 userId일 수 있으므로 두 가지 방법을 시도
            Page<Space> spaces;
            
            // 1. 먼저 hostId로 직접 조회 시도
            spaces = spaceRepository.findByHostId(hostId, pageable);
            
            // 2. 만약 결과가 없다면, hostId를 userId로 간주하고 Host를 찾아서 조회
            if (spaces.getTotalElements() == 0) {
                Host host = hostRepository.findByUserId(hostId)
                        .orElseThrow(() -> new IllegalArgumentException("호스트를 찾을 수 없습니다. User ID: " + hostId));
                spaces = spaceRepository.findByHostId(host.getId(), pageable);
            }
            
            return spaces.map(SpaceResponseDto::fromEntity);
        } catch (Exception e) {
            System.err.println("SpaceService 에러: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

}
