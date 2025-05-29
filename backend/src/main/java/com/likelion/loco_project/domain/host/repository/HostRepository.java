package com.likelion.loco_project.domain.host.repository;

import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, Long> {
    // user_id 호스트 찾기
    Optional<Host> findByUserId(Long userId);

    // User 엔티티로 Host를 찾는 메서드 추가
    Optional<Host> findByUser(User user);
}
