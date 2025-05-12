package com.likelion.loco_project.global.exception; // 예외 패키지 경로

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// @ResponseStatus : 이 예외 발생 시 HTTP 상태 코드 -> 403 Forbidden 설정
@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccessDeniedException extends RuntimeException {
    // 기본 생성자
    public AccessDeniedException() {
        super("접근이 불가능합니다."); // 기본 메시지
    }

    // 메시지를 받는 생성자
    public AccessDeniedException(String message) {
        super(message);
    }

    // 메시지와 원인 예외를 받는 생성자
    public AccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}