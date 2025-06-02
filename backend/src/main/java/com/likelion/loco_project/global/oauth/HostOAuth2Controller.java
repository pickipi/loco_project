package com.likelion.loco_project.global.oauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Controller
public class HostOAuth2Controller {

    @GetMapping("/host/oauth2/authorization/kakao")
    public String hostKakaoLogin(HttpServletRequest request, 
                                @RequestParam(value = "redirect_uri", required = false) String redirectUri) {
        // 세션에 호스트 로그인 정보 저장
        HttpSession session = request.getSession();
        session.setAttribute("oauth_userType", "HOST");
        
        log.info("Host OAuth2 login initiated, redirect_uri: {}", redirectUri);
        
        // 실제 OAuth2 엔드포인트로 리다이렉트
        String kakaoAuthUrl = "/oauth2/authorization/kakao";
        if (redirectUri != null) {
            kakaoAuthUrl += "?redirect_uri=" + redirectUri;
        }
        
        return "redirect:" + kakaoAuthUrl;
    }
} 