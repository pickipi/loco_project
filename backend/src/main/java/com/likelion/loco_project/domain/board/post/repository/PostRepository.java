package com.likelion.loco_project.domain.board.post.repository;

import com.likelion.loco_project.domain.board.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

}
