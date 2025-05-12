package com.likelion.loco_project.domain.board.comment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CodeReviewTestController {
    @GetMapping
    public String index() {
        return "코드리뷰테스트 - Index";
    }

    @GetMapping
    public String create(){
        return "코드리뷰테스트 - Post Created";
    }
}
