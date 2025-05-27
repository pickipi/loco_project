package com.likelion.loco_project.domain.board.comment.controller;

import com.likelion.loco_project.domain.board.comment.dto.CommentRequestDto;
import com.likelion.loco_project.domain.board.comment.dto.CommentResponseDto;
import com.likelion.loco_project.domain.board.comment.service.CommentService;
import com.likelion.loco_project.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards/{boardId}/comments")
@Tag(name = "댓글", description = "댓글 관련 API, 공간 게시판에 댓글 작성 / 수정 / 삭제")
public class ApiV1CommentController {
    private final CommentService commentService;

    @Operation(summary = "댓글 작성", description = "게시글에 새로운 댓글을 작성합니다.")
    @PostMapping
    public ResponseEntity<RsData<CommentResponseDto>> createComment(
            @PathVariable Long boardId,
            @RequestBody CommentRequestDto requestDto,
            @RequestAttribute Long userId) {
        CommentResponseDto response = commentService.createComment(boardId, requestDto, userId);
        return ResponseEntity.ok(RsData.of("S-200", "댓글 작성 성공", response));
    }

    @Operation(summary = "댓글 목록 조회", description = "게시글의 모든 댓글을 조회합니다.")
    @GetMapping
    public ResponseEntity<RsData<List<CommentResponseDto>>> getComments(@PathVariable Long boardId) {
        List<CommentResponseDto> response = commentService.getCommentsByBoardId(boardId);
        return ResponseEntity.ok(RsData.of("S-200", "댓글 목록 조회 성공", response));
    }

    @Operation(summary = "댓글 수정", description = "작성한 댓글을 수정합니다.")
    @PutMapping("/{commentId}")
    public ResponseEntity<RsData<CommentResponseDto>> updateComment(
            @PathVariable Long boardId,
            @PathVariable Long commentId,
            @RequestBody CommentRequestDto requestDto,
            @RequestAttribute Long userId) {
        CommentResponseDto response = commentService.updateComment(commentId, requestDto, userId);
        return ResponseEntity.ok(RsData.of("S-200", "댓글 수정 성공", response));
    }

    @Operation(summary = "댓글 삭제", description = "작성한 댓글을 삭제합니다.")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<RsData<Void>> deleteComment(
            @PathVariable Long boardId,
            @PathVariable Long commentId,
            @RequestAttribute Long userId) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(RsData.of("S-200", "댓글 삭제 성공"));
    }
}