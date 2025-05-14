package com.likelion.loco_project.domain.board.comment.service;

import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.repository.BoardRepository;
import com.likelion.loco_project.domain.board.comment.dto.CommentRequestDto;
import com.likelion.loco_project.domain.board.comment.dto.CommentResponseDto;
import com.likelion.loco_project.domain.board.comment.entity.Comment;
import com.likelion.loco_project.domain.board.comment.repository.CommentRepository;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import com.likelion.loco_project.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponseDto createComment(Long boardId, CommentRequestDto requestDto, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("게시글을 찾을 수 없습니다: " + boardId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        Comment comment = Comment.builder()
                .content(requestDto.getContent())
                .board(board)
                .user(user)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return new CommentResponseDto(savedComment);
    }

    public List<CommentResponseDto> getCommentsByBoardId(Long boardId) {
        List<Comment> comments = commentRepository.findAllByBoardId(boardId);
        return comments.stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto requestDto, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다: " + commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("댓글 수정 권한이 없습니다.");
        }

        comment.updateContent(requestDto.getContent());
        return new CommentResponseDto(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다: " + commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("댓글 삭제 권한이 없습니다.");
        }

        comment.delete();
    }
}
