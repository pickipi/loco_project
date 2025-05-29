package com.likelion.loco_project.global.oauth;

import com.likelion.loco_project.global.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {
        PrincipalOAuth2User principal = (PrincipalOAuth2User) authentication.getPrincipal();
        String email = principal.getUser().getEmail();

        // 신규 사용자라면 회원가입 페이지로 리다이렉트
        if (principal.isNewUser()) {
            // 한글 메시지를 퍼센트 인코딩해서 Location 헤더에 넣어야 Tomcat이 튕기지 않습니다.
            String signupUrl = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:3000/signup")
                    .queryParam("email", email)
                    .queryParam("msg", "최초 로그인은 회원가입이 필요합니다")
                    .build()        // 빌드만 하면 한글이 그대로 남음
                    .encode()      // 퍼센트 인코딩 수행
                    .toUriString();

            response.sendRedirect(signupUrl);
            return;
        }

        // 기존 사용자: JWT 생성 후 프론트로 리다이렉트
        Long userId = principal.getUser().getId();
        String role   = principal.getRole();
        String realName = principal.getUser().getUsername();
        String phone = principal.getPhoneNumber();

        String accessToken  = jwtTokenProvider.generateAccessToken(userId, role);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId, role);

        String redirectUrl = UriComponentsBuilder
                .fromHttpUrl("http://localhost:3000/oauth2/success")
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("email", email)
                .queryParam("name", realName)
                .queryParam("phone", phone)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
