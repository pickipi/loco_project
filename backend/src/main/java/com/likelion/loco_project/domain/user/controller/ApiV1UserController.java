package com.likelion.loco_project.domain.user.controller;

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
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(@RequestParam String email, @RequestParam String password) {
        UserResponseDto user = userService.login(email, password);
        return ResponseEntity.ok(user);
    }
}
