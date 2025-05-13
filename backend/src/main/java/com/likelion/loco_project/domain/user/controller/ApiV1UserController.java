package com.likelion.loco_project.domain.user.controller;

import com.likelion.loco_project.domain.user.dto.LoginRequestDto;
import com.likelion.loco_project.domain.user.dto.UserRequestDto;
import com.likelion.loco_project.domain.user.dto.UserResponseDto;
import com.likelion.loco_project.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class ApiV1UserController {
    private final UserService userService;

    // 회원가입
    @PostMapping
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody UserRequestDto dto) {
        UserResponseDto createdUser = userService.createUser(dto);
        return ResponseEntity.ok(createdUser);
    }

    // 유저 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable(name = "id") Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // 로그인 @RequestParam 방식 -> @RequestBody + DTO 으로 변경(for Swagger Test)
    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto dto) {
        UserResponseDto response = userService.login(dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok(response);
    }

    // 유저 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable(name = "id") Long id,
            @RequestBody UserRequestDto dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    // 유저 정보 삭제
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDeleteUser(@PathVariable(name = "id") Long id) {
        userService.hardDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
