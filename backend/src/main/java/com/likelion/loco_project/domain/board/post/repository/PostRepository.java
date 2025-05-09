package com.likelion.loco_project.domain.board.post.repository;

import com.likelion.loco_project.domain.board.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findById(Long id); // id를 이용하여 게시글 찾기
}
