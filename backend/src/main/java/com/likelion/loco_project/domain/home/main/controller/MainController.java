package com.likelion.loco_project.domain.home.main.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MainController {

    @Value("${custom.site.backUrl}")
    private String backUrl;

    @Value("${custom.site.frontUrl}")
    private String frontUrl;

    @GetMapping("/")
    public String mainPage(){

        System.out.println("backUrl = " + backUrl);
        System.out.println("frontUrl = " + frontUrl);

        return "LoCo 프로젝트 메인페이지에 오신 것을 환영합니다.";
    }
}