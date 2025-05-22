package com.likelion.loco_project.domain.board.board.repository;

import com.likelion.loco_project.domain.board.board.entity.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    // 특정 게시글에 속한 이미지 목록 조회 메소드
    List<BoardImage> findByBoardId(Long boardId);
}
