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

    /**
     * 새로운 댓글을 생성합니다.
     * @param boardId 댓글이 작성될 게시글의 ID
     * @param requestDto 댓글 내용을 담은 DTO
     * @param userId 댓글 작성자의 사용자 ID
     * @return 생성된 댓글 정보를 담은 DTO
     */
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
        return CommentResponseDto.from(savedComment);
    }

    /**
     * 특정 게시글의 모든 댓글을 조회합니다.
     * @param boardId 조회할 게시글의 ID
     * @return 댓글 목록을 담은 DTO 리스트
     */
    public List<CommentResponseDto> getCommentsByBoardId(Long boardId) {
        List<Comment> comments = commentRepository.findAllByBoardIdAndIsDeletedFalseOrderByCreatedDateDesc(boardId);
        return comments.stream()
                .map(CommentResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 기존 댓글을 수정합니다.
     * @param commentId 수정할 댓글의 ID
     * @param requestDto 수정할 댓글 내용을 담은 DTO
     * @param userId 수정 요청한 사용자의 ID
     * @return 수정된 댓글 정보를 담은 DTO
     */
    @Transactional
    public CommentResponseDto updateComment(Long commentId, CommentRequestDto requestDto, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("댓글을 찾을 수 없습니다: " + commentId));

        if (!comment.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("댓글 수정 권한이 없습니다.");
        }

        comment.updateContent(requestDto.getContent());
        return CommentResponseDto.from(comment);
    }

    /**
     * 댓글을 삭제합니다 (소프트 삭제).
     * @param commentId 삭제할 댓글의 ID
     * @param userId 삭제 요청한 사용자의 ID
     */
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