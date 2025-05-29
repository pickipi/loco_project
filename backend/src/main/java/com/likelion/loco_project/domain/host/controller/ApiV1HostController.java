package com.likelion.loco_project.domain.host.controller;

import com.likelion.loco_project.domain.host.dto.HostRequestDto;
import com.likelion.loco_project.domain.host.dto.HostResponseDto;
import com.likelion.loco_project.domain.host.entity.Host;
import com.likelion.loco_project.domain.host.service.HostService;
import com.likelion.loco_project.domain.user.dto.LoginRequestDto;
import com.likelion.loco_project.domain.user.dto.LoginResponseDto;
import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.service.UserService;
import com.likelion.loco_project.global.jwt.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hosts")
@RequiredArgsConstructor
@Tag(name = "호스트", description = "호스트 관련 API, 호스트 등록 / 조회")
public class ApiV1HostController {

    private final HostService hostService;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider; // 호스트 로그인 유지를 위함

    @Operation(summary = "전체 호스트 조회", description = "등록된 모든 호스트 정보를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<HostResponseDto>> getAllHosts() {
        List<HostResponseDto> hosts = hostService.getAllHosts();
        return ResponseEntity.ok(hosts);
    }

    // 호스트 등록 API (POST /api/v1/hosts/{userId})
    @Operation(summary = "호스트 등록", description = "특정 유저 ID로 호스트를 등록합니다.")
    @PostMapping("/{userId}")
    public ResponseEntity<HostResponseDto> register(@Parameter(description = "등록할 유저 ID", example = "1")
    @PathVariable("userId") Long userId,
                                                    @RequestBody HostRequestDto requestDto) {
        return ResponseEntity.ok(hostService.registerHost(userId, requestDto));
    }

    // 호스트 정보 조회 API (GET /api/v1/hosts/{userId})
    @Operation(
        summary = "호스트 정보 조회",
        description = "특정 유저 ID로 호스트 정보를 조회합니다.",
        responses = {
            @ApiResponse(responseCode = "200", description = "호스트 정보 조회 성공"),
            @ApiResponse(responseCode = "404", description = "호스트 정보를 찾을 수 없음")
        }
    )
    @GetMapping("/{userId}")
    public ResponseEntity<HostResponseDto> getHost(
            @Parameter(description = "호스트 정보를 조회할 유저 ID", required = true, example = "1")
            @PathVariable Long userId) {
        return ResponseEntity.ok(hostService.getHostInfo(userId));
    }

    //호스트 페이지에서 바로 회원가입
    @Operation(summary = "호스트 회원가입", description = "호스트 페이지에서 직접 회원가입을 진행합니다.")
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDto dto) {
        hostService.registerHost(dto);
        return ResponseEntity.ok("호스트 회원가입 완료");
    }

}
