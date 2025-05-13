package com.likelion.loco_project.domain.board.board.controller;

import com.likelion.loco_project.domain.board.board.dto.BoardDetailResponseDto;
import com.likelion.loco_project.domain.board.board.dto.BoardListResponseDto;
import com.likelion.loco_project.domain.board.board.dto.BoardRequestDto;
import com.likelion.loco_project.domain.board.board.dto.BoardResponseDto;
import com.likelion.loco_project.domain.board.board.service.BoardService;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import com.likelion.loco_project.global.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards") // 기본 URL 경로 설정
public class ApiV1BoardController {
    private final BoardService boardService;

    /** [SELECT]
     * 모든 게시글 목록을 조회 : GET /api/v1/boards
     * @param pageable 페이징 및 정렬 정보를 담은 객체 (Spring Data JPA Pageable)
     * @return 페이징된 게시글 목록 정보와 함께 HTTP 상태 코드 200 (OK) 반환
     */
    @GetMapping
    public ResponseEntity<List<BoardListResponseDto>> getAllBoards(
            @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable // 기본 페이징 설정
    ) {
        // BoardService의 getAllBoards 메소드 호출하여 게시글 목록 조회 비즈니스 로직 수행
        // Service 메소드가 Page<BoardListResponseDto>를 반환하도록 변경할 수도 있습니다.
        List<BoardListResponseDto> boards = boardService.getAllBoards(pageable);

        // 조회된 게시글 목록(DTO 리스트)과 함께 HTTP 상태 코드 200 (OK) 반환
        return ResponseEntity.ok(boards);
    }

    /** [SELECT]
     * 특정 게시글의 상세 정보를 조회 : GET /api/v1/boards/{id}
     * @param id 조회할 게시글의 고유 ID (경로 변수)
     * @return 게시글 상세 정보와 함께 HTTP 상태 코드 200 (OK) 반환
     * @throws ResourceNotFoundException 게시글을 찾을 수 없을 때 발생
     */
    @GetMapping("/{id}")
    public ResponseEntity<BoardDetailResponseDto> getBoardById(@PathVariable Long id) { // @PathVariable로 경로 변수 값을 Long 타입 id로 받음
        // BoardService의 getBoardById 메소드 호출하여 게시글 상세 조회 비즈니스 로직 수행
        BoardDetailResponseDto board = boardService.getBoardById(id);

        // 조회된 게시글 상세 정보(DTO)와 함께 HTTP 상태 코드 200 (OK) 반환
        return ResponseEntity.ok(board);
    }

    /** [CREATE]
     * 게시글 작성 : POST /api/v1/boards
     * @param boardRequestDto 게시글 생성 요청 데이터 (JSON 형태)
     * @param userDetails 인증된 사용자의 정보 (Spring Security 제공)
     * @return 생성된 게시글 정보와 함께 HTTP 상태 코드 201 (Created) 반환
     * @throws ResourceNotFoundException Space 또는 Host를 찾을 수 없을 때 발생
     * @throws AccessDeniedException 사용자가 호스트가 아니거나 권한이 없을 때 발생
     */
    @PostMapping // HTTP POST 요청 처리
    public ResponseEntity<BoardResponseDto> createBoard(
            @Valid @RequestBody BoardRequestDto boardRequestDto, // 요청 본문을 BoardRequestDto 객체로 매핑하고 유효성 검사 수행
            @AuthenticationPrincipal UserDetails userDetails // 현재 인증된 사용자의 UserDetails 객체 주입
    ) {
        // 프로젝트의 UserDetails 구현체에서 사용자 ID(Long)를 String으로 반환한다고 가정합니다.
        Long userId = Long.parseLong(userDetails.getUsername()); // UserDetails에서 사용자 ID 가져와 Long으로 변환

        // BoardService의 createBoard 메소드 호출하여 게시글 생성 비즈니스 로직 수행
        BoardResponseDto createdBoard = boardService.createBoard(boardRequestDto, userId);

        // 생성된 게시글 정보(DTO)와 함께 HTTP 상태 코드 201 (Created) 반환
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBoard);
    }

    /** [UPDATE]
     * 특정 게시글을 수정 : PUT /api/v1/boards/{id}
     * @param id 수정할 게시글의 고유 ID (경로 변수)
     * @param boardRequestDto 게시글 수정 요청 데이터 (JSON 형태)
     * @param userDetails 인증된 사용자의 정보
     * @return 수정된 게시글 정보와 함께 HTTP 상태 코드 200 (OK) 반환
     * @throws ResourceNotFoundException 게시글 또는 공간을 찾을 수 없을 때 발생
     * @throws AccessDeniedException 수정 권한이 없을 때 발생
     */
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDto> updateBoard(
            @PathVariable Long id, // 수정할 게시글 ID
            @Valid @RequestBody BoardRequestDto boardRequestDto, // 수정 요청 데이터
            @AuthenticationPrincipal UserDetails userDetails // 현재 인증된 사용자 정보
    ) {
        // userDetails 객체에서 사용자 ID 가져오기
        Long userId = Long.parseLong(userDetails.getUsername());

        // BoardService의 updateBoard 메소드 호출하여 게시글 수정 비즈니스 로직 수행
        BoardResponseDto updatedBoard = boardService.updateBoard(id, boardRequestDto, userId);

        // 수정된 게시글 정보(DTO)와 함께 HTTP 상태 코드 200 (OK) 반환
        return ResponseEntity.ok(updatedBoard);
    }

    /** [DELETE]
     * 특정 게시글을 삭제 : DELETE /api/v1/boards/{id}
     * @param id 삭제할 게시글의 고유 ID (경로 변수)
     * @param userDetails 인증된 사용자의 정보
     * @return 성공 시 HTTP 상태 코드 204 (No Content) 반환
     * @throws ResourceNotFoundException 게시글을 찾을 수 없을 때 발생
     * @throws AccessDeniedException 삭제 권한이 없을 때 발생
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable Long id, // 삭제할 게시글 ID
            @AuthenticationPrincipal UserDetails userDetails // 현재 인증된 사용자 정보
    ) {
        // userDetails 객체에서 사용자 ID 가져오기
        Long userId = Long.parseLong(userDetails.getUsername());

        // BoardService의 deleteBoard 메소드 호출하여 게시글 삭제 비즈니스 로직 수행
        boardService.deleteBoard(id, userId);

        // 삭제 성공 시 응답 본문 없이 HTTP 상태 코드 204 (No Content) 반환
        return ResponseEntity.noContent().build();
    }
}
