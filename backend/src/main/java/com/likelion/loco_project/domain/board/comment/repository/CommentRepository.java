package com.likelion.loco_project.domain.board.comment.repository;

import com.likelion.loco_project.domain.board.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByBoardIdAndIsDeletedFalseOrderByCreatedDateDesc(Long boardId);
}
