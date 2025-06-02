package com.likelion.loco_project.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionCode {

    MEMBER_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 회원입니다."),    UNABLE_TO_SEND_EMAIL(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 전송에 실패했습니다."),
    NO_SUCH_ALGORITHM(HttpStatus.INTERNAL_SERVER_ERROR, "알 수 없는 암호화 알고리즘입니다."),
    EMAIL_NOT_VERIFIED(HttpStatus.BAD_REQUEST, "이메일 인증이 필요합니다."),
    USER_TYPE_NOT_MATCH(HttpStatus.BAD_REQUEST, "유저 타입이 맞지 않습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    CANNOT_MODIFY_ADMIN(HttpStatus.FORBIDDEN, "관리자의 권한은 변경할 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ExceptionCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}