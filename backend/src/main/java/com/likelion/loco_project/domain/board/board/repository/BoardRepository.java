package com.likelion.loco_project.domain.board.board.repository;

import com.likelion.loco_project.domain.board.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Optional<Board> findById(Long id); // id를 이용하여 게시글 찾기
}
