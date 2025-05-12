package com.likelion.loco_project.domain.board.board.repository;

import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // 특정 호스트가 작성한 게시글 목록 조회
    List<Board> findByHostId(Long hostId);

    // 특정 공간에 대한 게시글 목록 조회
    List<Board> findBySpaceId(Long spaceId);

    // 제목이나 내용으로 게시글 검색 (대소문자 구분 없이)
    List<Board> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String titleKeyword, String descriptionKeyword);

    // 카테고리별 게시글 목록 조회
    List<Board> findByCategory(Category category);
}
