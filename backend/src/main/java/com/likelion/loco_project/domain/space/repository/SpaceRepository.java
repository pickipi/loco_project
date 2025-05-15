package com.likelion.loco_project.domain.space.repository;

import com.likelion.loco_project.domain.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.host.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {

    // ✅ 1. 특정 호스트가 등록한 공간 조회
    List<Space> findByHost(Host host);

    // ✅ 2. 활성화된 공간만 조회
    List<Space> findByIsActiveTrue();

    // ✅ 3. 공간 이름으로 검색 (부분 일치)
    List<Space> findBySpaceNameContaining(String keyword);

    // ✅ 4. 가격 범위로 필터링
    List<Space> findByPriceBetween(Long min, Long max);

    // ✅ 5. 타입별 공간 조회
    List<Space> findBySpaceType(String spaceType);

    // 필요 시 페이징 또는 정렬도 가능 (Pageable 매개변수 활용)

    @Query("""
    SELECT s FROM Space s
    WHERE s.latitude BETWEEN :latMin AND :latMax
      AND s.longitude BETWEEN :lngMin AND :lngMax
      AND s.isActive = true
""")
    List<Space> findNearbySpaces(
            @Param("latMin") BigDecimal latMin,
            @Param("latMax") BigDecimal latMax,
            @Param("lngMin") BigDecimal lngMin,
            @Param("lngMax") BigDecimal lngMax
    );
}