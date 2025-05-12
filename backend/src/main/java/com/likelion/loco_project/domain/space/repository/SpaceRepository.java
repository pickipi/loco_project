package com.likelion.loco_project.domain.space.repository;

import com.likelion.loco_project.domain.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpaceRepository extends JpaRepository<Space, Long> {
    // 공간 ID로 공간 조회
    Optional<Space> findById(Long id);
}
