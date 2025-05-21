package com.likelion.loco_project.domain.board.board.service;

import com.likelion.loco_project.domain.board.board.dto.*;
import com.likelion.loco_project.domain.board.board.entity.Board;
import com.likelion.loco_project.domain.board.board.entity.BoardImage;
import com.likelion.loco_project.domain.board.board.repository.BoardImageRepository;
import com.likelion.loco_project.domain.board.board.repository.BoardRepository;
import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.repository.HostRepository;
import com.likelion.loco_project.domain.s3.S3Service;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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

    // 이미지 관련
    private static final int MAX_IMAGE_COUNT = 5; // 최대 이미지 개수
    private final S3Service s3Service; // S3 서비스 주입 (이미지 업로드 등)
    private final BoardImageRepository boardImageRepository; // 게시글 이미지 레포지토리 (이미지 저장 등)

    /**
     * 1. 게시글 작성
     * @param createBoardRequestDto 게시글 생성 요청 DTO
     * @param userId          게시글 작성자 (User)의 ID
     * @return 생성된 게시글 정보 응답 DTO
     * @throws ResourceNotFoundException Space 또는 Host를 찾을 수 없을 때 발생
     * @throws AccessDeniedException    사용자가 호스트가 아닐 때 발생
     */
    @Transactional
    public BoardResponseDto createBoard(CreateBoardRequestDto createBoardRequestDto, Long userId){
        // 게시글 생성에 필요한 엔티티 조회 및 검증
        BoardCreationEntities entities = getBoardCreationEntities(createBoardRequestDto.getSpaceId(), userId);

        // Board 엔티티 생성
        Board board = createBoardEntity(createBoardRequestDto, entities.host, entities.space);

        // 만들어진 엔티티를 Repository를 통해 DB에 저장
        Board savedBoard = boardRepository.save(board);

        // 이미지 파일 S3 업로드 및 BoardImage 엔티티 생성/저장
        List<BoardImageResponseDto> savedImages = processAndSaveBoardImages(savedBoard, createBoardRequestDto.getThumbnailFile(), createBoardRequestDto.getOtherImageFiles());

        // 저장된 Entity를 BoardResponseDto로 변환하여 반환
        String authorName = entities.authorUser.getUsername();
        String spaceName = entities.space.getSpaceName();
        return BoardResponseDto.from(savedBoard, authorName, spaceName, savedImages);
    }

    // 게시글 생성에 필요한 엔티티들을 조회하고 반환하는 내부 클래스 및 메서드
    private static class BoardCreationEntities {
        User authorUser;
        Host host;
        Space space;

        BoardCreationEntities(User authorUser, Host host, Space space) {
            this.authorUser = authorUser;
            this.host = host;
            this.space = space;
        }
    }

    private BoardCreationEntities getBoardCreationEntities(Long spaceId, Long userId) {
        // 1. 게시글 작성자 (User) 확인 및 호스트 정보 조회
        User authorUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("유저ID를 찾을 수 없습니다 : " + userId));

        // 2. 이 작성자 (User)가 호스트인지 체크, 호스트 정보가 없으면 예외 발생
        Host authorHost = hostRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("이 유저ID에 대한 호스트 정보가 존재하지 않습니다 : " + userId + ", 호스트만이 게시글을 작성할 수 있습니다."));

        // 3. 게시글이 등록될 공간 정보 조회
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new ResourceNotFoundException("ID에 해당하는 공간을 찾을 수 없습니다 : " + spaceId));

        return new BoardCreationEntities(authorUser, authorHost, space);
    }

    // CreateBoardRequestDto와 엔티티를 사용하여 Board 엔티티를 생성하는 private 메서드
    private Board createBoardEntity(CreateBoardRequestDto createBoardRequestDto, Host host, Space space) {
        return Board.builder()
                .title(createBoardRequestDto.getTitle())
                .description(createBoardRequestDto.getDescription())
                .category(createBoardRequestDto.getCategory())
                .isVisible(createBoardRequestDto.getIsVisible() != null ? createBoardRequestDto.getIsVisible() : true)
                .report(false)
                .host(host)
                .space(space)
                .build();
    }

    // 이미지 파일 처리 및 저장을 담당하는 private 메서드
    private List<BoardImageResponseDto> processAndSaveBoardImages(Board board, MultipartFile thumbnailFile, List<MultipartFile> otherImageFiles) {
         List<BoardImageResponseDto> savedImages = new ArrayList<>();

        // 썸네일 이미지 처리
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            BoardImage thumbnailImage = saveBoardImage(board, thumbnailFile, true);
            savedImages.add(BoardImageResponseDto.from(thumbnailImage));
        }

        // 추가 이미지 처리 (최대 MAX_IMAGE_COUNT 장 제한)
        if (otherImageFiles != null && !otherImageFiles.isEmpty()) {
            int imageCount = 0;
            for (MultipartFile otherFile : otherImageFiles) {
                if (imageCount < MAX_IMAGE_COUNT && otherFile != null && !otherFile.isEmpty()) {
                    BoardImage otherImage = saveBoardImage(board, otherFile, false);
                    savedImages.add(BoardImageResponseDto.from(otherImage));
                    imageCount++;
                } else if (imageCount >= MAX_IMAGE_COUNT) {
                    break;
                }
            }
        }
        return savedImages;
    }

    // 이미지 저장 중복 코드를 분리한 private 메서드
    private BoardImage saveBoardImage(Board board, MultipartFile file, boolean isThumbnail) {
        String s3ObjectKey = s3Service.uploadFile(file);
        BoardImage boardImage = BoardImage.builder()
                .filePath(s3ObjectKey)
                .isThumbnail(isThumbnail)
                .board(board)
                .build();
        return boardImageRepository.save(boardImage);
    }

    /** 2-1. 모든 게시글 조회
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
                    String authorName = board.getHost() != null && board.getHost().getUser() != null ? board.getHost().getUser().getUsername() : "Unknown";
                    String spaceName = board.getSpace() != null ? board.getSpace().getSpaceName() : "Unknown";
                    return BoardListResponseDto.from(board, authorName, spaceName);
                })
                .collect(Collectors.toList());
    }

    /** 2-2. 특정 게시글 조회
     * 특정 게시글의 상세 정보를 조회, 연관된 이미지 목록 조회 로직 (S3 객체 키 사용)
     * @param id 조회할 게시글의 ID
     * @return 게시글 상세 정보 응답 DTO
     * @throws ResourceNotFoundException 게시글을 찾을 수 없을 때 발생
     */
    public BoardDetailResponseDto getBoardById(Long id) {
        // 1. Repository를 사용하여 ID로 게시글 조회 (존재하지 않으면 예외 발생)
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("게시글을 찾을 수 없습니다 : " + id));

        // 2. 연관된 이미지 목록 조회 (BoardImage 엔티티는 S3 객체 키를 저장)
        List<BoardImage> boardImages = boardImageRepository.findByBoardId(board.getId());

        // 3. 조회된 Entity와 연관 정보를 BoardDetailResponseDto로 변환하여 반환 (이미지 정보 포함)
        String authorName = board.getHost() != null && board.getHost().getUser() != null ? board.getHost().getUser().getUsername() : "알 수 없음";
        String spaceName = board.getSpace() != null ? board.getSpace().getSpaceName() : "알 수 없음";

        // BoardImage 엔티티 리스트를 BoardImageResponseDto 리스트로 변환
        List<BoardImageResponseDto> imageResponseDtos = boardImages.stream()
                .map(BoardImageResponseDto::from) // BoardImageResponseDto는 filePath(S3 객체 키)를 가짐
                .collect(Collectors.toList());

        return BoardDetailResponseDto.from(board, authorName, spaceName);
    }

    /** 3. 게시글 수정
     * 이미지 수정 로직 (기존 S3 객체 삭제 후 새로 업로드하는 방식)
     * @param id              수정할 게시글의 ID
     * @param createBoardRequestDto 게시글 수정 요청 DTO
     * @param userId          수정 요청 사용자 (User)의 ID
     * @return 수정된 게시글 정보 응답 DTO
     * @throws ResourceNotFoundException 게시글 또는 공간을 찾을 수 없을 때 발생
     * @throws AccessDeniedException    수정 권한이 없을 때 발생
     */
    @Transactional // 데이터 변경이 있으므로 쓰기 트랜잭션 설정
    public BoardResponseDto updateBoard(Long id, CreateBoardRequestDto createBoardRequestDto, Long userId) {
        // 1. 수정할 게시글 조회 (존재하지 않으면 예외 발생)
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("게시글을 찾을 수 없습니다 : " + id)); // ⭐ 게시글 없을 때 예외 발생

        // 2. 수정 권한 확인
        // 현재 로그인한 사용자가 게시글 작성자(호스트) 본인이거나 관리자인지 확인
        if (!board.getHost().getUser().getId().equals(userId)) { // board.getHost().getUser().getId() = 해당 게시글 작성자의 User ID
            throw new AccessDeniedException("게시글 수정 권한이 없습니다.");
        }

        // 3. DTO의 데이터로 Entity 업데이트
        Space updatedSpace = board.getSpace(); // 기본값은 현재 게시글에 연결된 공간
        if (!board.getSpace().getId().equals(createBoardRequestDto.getSpaceId())) {
            updatedSpace = spaceRepository.findById(createBoardRequestDto.getSpaceId())
                    .orElseThrow(() -> new ResourceNotFoundException("공간을 찾을 수 없습니다 : " + createBoardRequestDto.getSpaceId()));
        }

        board.setTitle(createBoardRequestDto.getTitle()); // 제목 업데이트
        board.setDescription(createBoardRequestDto.getDescription()); // 내용 업데이트
        board.setCategory(createBoardRequestDto.getCategory()); // 카테고리 업데이트

        // isVisible은 DTO에서 값이 넘어왔을 경우에만 업데이트, 아니면 기존 값 유지
        if (createBoardRequestDto.getIsVisible() != null) {
            board.setIsVisible(createBoardRequestDto.getIsVisible());
        }
        board.setSpace(updatedSpace); // 공간 업데이트

        // 3-1. 기존 S3 객체 삭제 및 BoardImage 엔티티 삭제 후 새로운 이미지 S3 업로드 및 엔티티 생성/저장
        // (=기존 이미지를 모두 삭제하고 새로 업로드된 이미지만 저장)
        deleteBoardImages(board.getId()); // 기졸 이미지 관련 BoardImage 엔티티 및 S3 객체 삭제
        List<BoardImageResponseDto> savedImages = new ArrayList<>();

        // 3-2. 썸네일 이미지 처리
        MultipartFile thumbnailFile = createBoardRequestDto.getThumbnailFile();
        if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
            BoardImage thumbnailImage = saveBoardImage(board, thumbnailFile, true); // 분리된 메서드 호출
            savedImages.add(BoardImageResponseDto.from(thumbnailImage));
        }

        // 추가 이미지 처리 (최대 MAX_IMAGE_COUNT 장 제한)
        List<MultipartFile> otherImageFiles = createBoardRequestDto.getOtherImageFiles();
        if (otherImageFiles != null && !otherImageFiles.isEmpty()) {
            int imageCount = 0;
            for (MultipartFile otherFile : otherImageFiles) {
                if (imageCount < MAX_IMAGE_COUNT && otherFile != null && !otherFile.isEmpty()) {
                    BoardImage otherImage = saveBoardImage(board, otherFile, false); // 분리된 메서드 호출
                    savedImages.add(BoardImageResponseDto.from(otherImage));
                    imageCount++;
                } else if (imageCount >= MAX_IMAGE_COUNT) {
                    break;
                }
            }
        }

        // 4. Repository를 사용하여 데이터베이스에 저장
        // 5. 업데이트된 Entity를 BoardResponseDto로 변환하여 반환
        String authorName = board.getHost().getUser().getUsername();
        String spaceName = board.getSpace().getSpaceName();
        return BoardResponseDto.from(board, authorName, spaceName, savedImages);
    }

    /** 4. 게시글 삭제
     * 게시글 삭제 시 연관된 BoardImage 엔티티 및 S3 객체 삭제
     * @param id     삭제할 게시글의 ID
     * @param userId 삭제 요청 사용자 (User)의 ID
     * @throws ResourceNotFoundException 게시글을 찾을 수 없을 때 발생
     * @throws AccessDeniedException 삭제 권한이 없을 때 발생
     */
    @Transactional // 데이터 변경이 있으므로 쓰기 트랜잭션 설정
    public void deleteBoard(Long id, Long userId) {
        // 1. 삭제할 게시글 조회 (존재하지 않으면 예외 발생)
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("게시글을 찾을 수 없습니다 : " + id));

        // 2. 삭제 권한 확인
        // 현재 로그인한 사용자가 게시글 작성자(호스트) 본인이거나 관리자인지 확인
        if (!board.getHost().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }

        // 3.1. 게시글 삭제 전에 연관된 BoardImage 엔티티 및 S3 객체 삭제
        deleteBoardImages(board.getId());

        // 3.2. Repository를 사용하여 게시글 삭제
        boardRepository.delete(board); // 조회된 게시글 엔티티 삭제
    }

    /** 4.1. 특정 게시글 삭제 시 연관된 이미지 삭제
     * 특정 게시글에 연결된 모든 BoardImage 엔티티 및 해당 S3 객체를 삭제
     * @param boardId 게시글 ID
     */
    @Transactional
    private void deleteBoardImages(Long boardId) {
        List<BoardImage> imagesToDelete = boardImageRepository.findByBoardId(boardId);

        // 각 이미지에 대해 S3Service를 사용하여 S3 객체 삭제 및 엔티티 삭제
        for (BoardImage image : imagesToDelete) {
            s3Service.deleteFile(image.getFilePath());
            boardImageRepository.delete(image);
        }
    }
}
