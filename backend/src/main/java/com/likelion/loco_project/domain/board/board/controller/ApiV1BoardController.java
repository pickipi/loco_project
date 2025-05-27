package com.likelion.loco_project.domain.board.board.controller;

import com.likelion.loco_project.domain.board.board.dto.*;
import com.likelion.loco_project.domain.board.board.service.BoardService;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import com.likelion.loco_project.global.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/boards") // 기본 URL 경로 설정
@Tag(name = "공간 게시판", description = "공간 게시판 관련 API, 호스트 - 공간 등록 / 게스트 - 공간 열람")
public class ApiV1BoardController {
    private final BoardService boardService;

    /** [SELECT]
     * 모든 게시글 목록을 조회 : GET /api/v1/boards
     * @param pageable 페이징 및 정렬 정보를 담은 객체 (Spring Data JPA Pageable)
     * @return 페이징된 게시글 목록 정보와 함께 HTTP 상태 코드 200 (OK) 반환
     */
    @Operation(
        summary = "게시글 목록 조회",
        description = "페이징 처리된 게시글 목록을 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "게시글 목록 조회 성공")
        }
    )
    @GetMapping
    public ResponseEntity<List<BoardListResponseDto>> getAllBoards(
            @Parameter(description = "페이지 정보 (size: 페이지당 항목 수, sort: 정렬 기준, direction: 정렬 방향)")
            @PageableDefault(size = 10, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable
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
    @Operation(
        summary = "게시글 상세 조회",
        description = "특정 게시글의 상세 정보를 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "게시글 상세 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<BoardDetailResponseDto> getBoardById(
            @Parameter(description = "조회할 게시글 ID", required = true, example = "1")
            @PathVariable Long id) {
        BoardDetailResponseDto board = boardService.getBoardById(id);
        return ResponseEntity.ok(board);
    }

    /** [CREATE]
     * 게시글 작성 : POST /api/v1/boards
     * @param createBoardRequestDto 게시글 생성 요청 데이터 (JSON 형태)
     * @param userDetails 인증된 사용자의 정보 (Spring Security 제공)
     * @return 생성된 게시글 정보와 함께 HTTP 상태 코드 201 (Created) 반환
     * @throws ResourceNotFoundException Space 또는 Host를 찾을 수 없을 때 발생
     * @throws AccessDeniedException 사용자가 호스트가 아니거나 권한이 없을 때 발생
     */
    @Operation(summary = "게시글 작성", description = "새로운 게시글을 작성합니다. 호스트 권한이 필요합니다.")
    @PostMapping(value = "/{hostId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // HTTP POST 요청 처리
    public ResponseEntity<BoardResponseDto> createBoard(
            @PathVariable("hostId") Long hostId, // URL의 hostId 경로 변수
            @Valid @ModelAttribute CreateBoardRequestDto createBoardRequestDto, // 요청 본문을 BoardRequestDto 객체로 매핑하고 유효성 검사 수행
            @AuthenticationPrincipal UserDetails userDetails // 현재 인증된 사용자의 UserDetails 객체 주입
    ) {
        // 프로젝트의 UserDetails 구현체에서 사용자 ID(Long)를 String으로 반환한다고 가정합니다.
        Long userId = Long.parseLong(userDetails.getUsername()); // UserDetails에서 사용자 ID 가져와 Long으로 변환

        // 사용자 ID와 hostId가 일치하는지, 또는 실제 호스트 권한을 갖고 있는지 확인
        if (!userId.equals(hostId)) {
            throw new AccessDeniedException("호스트 ID가 일치하지 않거나 권한이 없습니다.");
        }

        BoardResponseDto createdBoard = boardService.createBoard(createBoardRequestDto, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdBoard);
    }

    /** [UPDATE]
     * 특정 게시글을 수정 : PUT /api/v1/boards/{id}
     * @param id 수정할 게시글의 고유 ID (경로 변수)
     * @param createBoardRequestDto 게시글 수정 요청 데이터 (JSON 형태)
     * @param userDetails 인증된 사용자의 정보
     * @return 수정된 게시글 정보와 함께 HTTP 상태 코드 200 (OK) 반환
     * @throws ResourceNotFoundException 게시글 또는 공간을 찾을 수 없을 때 발생
     * @throws AccessDeniedException 수정 권한이 없을 때 발생
     */
    @Operation(summary = "게시글 수정", description = "기존 게시글의 내용을 수정합니다. 작성자만 수정 가능합니다.")
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDto> updateBoard(
            @PathVariable Long id, // 수정할 게시글 ID
            @Valid @RequestBody CreateBoardRequestDto createBoardRequestDto, // 수정 요청 데이터
            @AuthenticationPrincipal UserDetails userDetails // 현재 인증된 사용자 정보
    ) {
        // userDetails 객체에서 사용자 ID 가져오기
        Long userId = Long.parseLong(userDetails.getUsername());

        // BoardService의 updateBoard 메소드 호출하여 게시글 수정 비즈니스 로직 수행
        BoardResponseDto updatedBoard = boardService.updateBoard(id, createBoardRequestDto, userId);

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
    @Operation(summary = "게시글 삭제", description = "게시글을 삭제합니다. 작성자만 삭제 가능합니다.")
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
