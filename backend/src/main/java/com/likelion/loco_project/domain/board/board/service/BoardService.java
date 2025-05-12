package com.likelion.loco_project.domain.board.board.service;

import com.likelion.loco_project.domain.board.board.dto.BoardRequestDto;
import com.likelion.loco_project.domain.board.board.dto.BoardResponseDto;
import com.likelion.loco_project.domain.board.board.repository.BoardRepository;
import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.space.repository.SpaceRepository;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.AccessDeniedException;
import com.likelion.loco_project.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("유저ID를 찾을 수 없습니다 : " + userId));

        // 2. 이 작성자 (User)가 호스트인지 체크, 호스트 정보가 없으면 예외 발생
        Host authorHost = hostRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("이 유저ID에 대한 호스트 정보가 존재하지 않습니다 : " + userId + ", 호스트만이 게시글을 작성할 수 있습니다."));

        return null;
    }
    // 게시글 수정

    // 게시글 삭제

    // 게시글 조회
}
