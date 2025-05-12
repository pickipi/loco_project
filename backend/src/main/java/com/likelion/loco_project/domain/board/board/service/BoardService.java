package com.likelion.loco_project.domain.board.board.service;

import com.likelion.loco_project.domain.board.board.dto.BoardListResponseDto;
import com.likelion.loco_project.domain.board.board.dto.BoardRequestDto;
import com.likelion.loco_project.domain.board.board.dto.BoardResponseDto;
import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.repository.BoardRepository;
import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.space.entity.Space;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import com.likelion.loco_project.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 읽기 전용 트랜잭션 기본 설정
public class BoardService {
    private final BoardRepository boardRepository;
    private final HostRepository hostRepository; // 호스트 레포지토리
    private final SpaceRepository spaceRepository; // 공간 레포지토리
    private final UserRepository userRepository; // 사용자 레포지토리 (권한 확인에 사용)

    /**
     * 1. 게시글 작성
     *
     * @param boardRequestDto 게시글 생성 요청 DTO
     * @param userId          게시글 작성자 (User)의 ID
     * @return 생성된 게시글 정보 응답 DTO
     * @throws ResourceNotFoundException Space 또는 Host를 찾을 수 없을 때 발생
     * @throws AccessDeniedException    사용자가 호스트가 아닐 때 발생
     */
    @Transactional
    public BoardResponseDto createBoard(BoardRequestDto boardRequestDto, Long userId){
        // 1. 게시글 작성자 (User) 확인 및 호스트 정보 조회
        User authorUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("유저ID를 찾을 수 없습니다 : " + userId));

        // 2. 이 작성자 (User)가 호스트인지 체크, 호스트 정보가 없으면 예외 발생
        Host authorHost = hostRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("이 유저ID에 대한 호스트 정보가 존재하지 않습니다 : " + userId + ", 호스트만이 게시글을 작성할 수 있습니다."));

        // 3. 게시글이 등록될 공간 정보 조회
        Space space = spaceRepository.findById(boardRequestDto.getSpaceId())
                .orElseThrow(() -> new ResourceNotFoundException("ID에 해당하는 공간을 찾을 수 없습니다 : " + boardRequestDto.getSpaceId()));

        // 4. 조회된 엔티티를 사용하여 Board 엔티티 객체 생성 (빌더패턴 사용)
        Board board = Board.builder()
                .title(boardRequestDto.getTitle())
                .description(boardRequestDto.getDescription())
                .category(boardRequestDto.getCategory())
                .isVisible(boardRequestDto.getIsVisible() != null ? boardRequestDto.getIsVisible() : true) // isVisible이 null이면 기본값 true 설정
                .report(false) // 신고 여부는 기본값 false
                .host(authorHost) // 연관관계 설정
                .space(space) // 연관관계 설정
                .build();

        // 5. 만들어진 엔티티를 Repository를 통해 DB에 저장
        Board savedBoard = boardRepository.save(board);

        // 6. 저장된 Entity를 BoardResponseDto로 변환하여 반환
        return BoardResponseDto.from(savedBoard, authorUser.getName(), space.getSpaceName());
    }

    // 게시글 조회
    /**
     * 모든 게시글 목록 조회 (페이징 기능)
     * @param pageable 페이징 정보 (페이지 번호, 페이지 크기, 정렬 기준 등)
     * @return 페이징된 게시글 목록 응답 DTO 리스트
     */
    public List<BoardListResponseDto> getAllBoards(Pageable pageable) {
        // 1. Repository를 사용하여 페이징된 게시글 목록 조회
        Page<Board> boardPage = boardRepository.findAll(pageable); // 기본적인 페이징 조회 (N+1 발생 가능)

        // 2. 조회된 Entity 목록을 BoardListResponseDto 리스트로 변환하여 반환
        return boardPage.getContent().stream()
                .map(board -> {
                    String authorName = board.getHost() != null && board.getHost().getUser() != null ? board.getHost().getUser().getName() : "Unknown";
                    String spaceName = board.getSpace() != null ? board.getSpace().getSpaceName() : "Unknown";
                    return BoardListResponseDto.from(board, authorName, spaceName);
                })
                .collect(Collectors.toList());
    }
}
