package com.likelion.loco_project.domain.space.repository;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.space.entity.Space;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Long>, JpaSpecificationExecutor<Space> {
    // JpaSpecificationExecutor<Space>는 동적 쿼리 생성을 위한 인터페이스, Specification을 사용하여 복잡한 쿼리를 작성할 수 있음

    // 특정 호스트가 등록한 공간 조회
    List<Space> findByHost(Host host);

    // 활성화된 공간만 조회
    List<Space> findByIsActiveTrue();

    // 공간 이름으로 검색 (부분 일치)
    List<Space> findBySpaceNameContaining(String keyword);

    // 가격 범위로 필터링
    List<Space> findByPriceBetween(Long min, Long max);

    // 타입별 공간 조회
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

    // 승인대기 공간 5건 (최신순)
    List<Space> findTop5ByStatusOrderByIdDesc(com.likelion.loco_project.domain.space.entity.SpaceStatus status);

    @Query("SELECT s.spaceType, COUNT(s) FROM Space s GROUP BY s.spaceType")
    Map<String, Long> countSpacesByType();

    @EntityGraph(attributePaths = "additionalImageUrls")
    @Override
    Page<Space> findAll(Pageable pageable);

    @Query("SELECT s FROM Space s WHERE s.host.id = :hostId")
    Page<Space> findByHostId(@Param("hostId") Long hostId, Pageable pageable);
}