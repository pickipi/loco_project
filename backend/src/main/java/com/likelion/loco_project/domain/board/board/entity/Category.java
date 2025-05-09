package com.likelion.loco_project.domain.board.board.entity;

import lombok.Getter;

@Getter
public enum Category {
    FREE("자유게시판"),
    QNA("Q&A"),
    NOTICE("공지사항");

    // Enum 상수의 값을 저장할 필드
    private final String displayName; // Enum 상수를 화면에 표시할 이름

    // Enum 생성자 : Enum 상수를 선언 시 호출
    Category(String displayName) {
        this.displayName = displayName;
    }
}
