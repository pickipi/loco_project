package com.likelion.loco_project.domain.host.repository;

import com.likelion.loco_project.domain.host.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HostRepository extends JpaRepository<Host, Long> {
    // userId로 호스트인지의 여부 조회
    Optional<Host> findByUserId(Long userId);
}
