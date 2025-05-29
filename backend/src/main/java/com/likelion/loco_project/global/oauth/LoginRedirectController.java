package com.likelion.loco_project.global.oauth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginRedirectController {

    /**
     * 스프링 시큐리티가 /login 을 가로채기 때문에,
     * GET /login 요청은 프론트 로그인 페이지로 리다이렉트합니다.
     */
    @GetMapping("/login")
    public String redirectToFrontend() {
        return "redirect:http://localhost:3000/login";
    }
}
