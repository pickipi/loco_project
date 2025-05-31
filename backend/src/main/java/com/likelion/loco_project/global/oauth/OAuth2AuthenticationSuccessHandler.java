package com.likelion.loco_project.global.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.likelion.loco_project.global.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {
        PrincipalOAuth2User principal = (PrincipalOAuth2User) authentication.getPrincipal();
        String email = principal.getUser().getEmail();
        
        // 리다이렉트 URI에서 호스트 로그인 여부 확인
        String redirectUri = request.getParameter("redirect_uri");
        boolean isHostLogin = redirectUri != null && redirectUri.contains("/host/");

        // 신규 사용자라면 회원가입 페이지로 리다이렉트
        if (principal.isNewUser()) {
            String signupUrl = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:3000")
                    .path(isHostLogin ? "/host/signup" : "/signup")
                    .queryParam("email", email)
                    .queryParam("msg", "최초 로그인은 회원가입이 필요합니다")
                    .build()
                    .encode()
                    .toUriString();

            response.sendRedirect(signupUrl);
            return;
        }

        // 기존 사용자: JWT 생성 후 프론트로 리다이렉트
        Long userId = principal.getUser().getId();
        String role = principal.getRole();
        String realName = principal.getUser().getUsername();
        String phone = principal.getPhoneNumber();

        String accessToken = jwtTokenProvider.generateAccessToken(userId, role);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId, role);

        // 호스트 로그인인 경우 호스트용 성공 페이지로 리다이렉트
        String redirectUrl = UriComponentsBuilder
                .fromHttpUrl("http://localhost:3000")
                .path(isHostLogin ? "/host/oauth2/success" : "/oauth2/success")
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("email", email)
                .queryParam("name", realName)
                .queryParam("phone", phone)
                .queryParam("role", role)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
