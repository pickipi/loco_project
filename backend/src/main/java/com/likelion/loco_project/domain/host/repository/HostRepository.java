package com.likelion.loco_project.domain.host.repository;

import com.likelion.loco_project.domain.host.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, Long> {
    // user_id 호스트 찾기
    Optional<Host> findByUserId(Long userId);
}
