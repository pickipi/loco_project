package com.likelion.loco_project.global.exception; // 예외 패키지 경로

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// @ResponseStatus : 이 예외 발생 시 HTTP 상태 코드 -> 404 Not Found 설정
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    // 기본 생성자
    public ResourceNotFoundException() {
        super("데이터를 찾을 수 없습니다."); // 기본 메시지
    }

    // 메시지를 받는 생성자
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // 메시지와 원인 예외를 받는 생성자
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}