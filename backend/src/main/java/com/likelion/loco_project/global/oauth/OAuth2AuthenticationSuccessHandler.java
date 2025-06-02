package com.likelion.loco_project.global.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.likelion.loco_project.global.jwt.JwtTokenProvider;
import com.likelion.loco_project.global.redis.RedisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RedisService redisService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {
        PrincipalOAuth2User principal = (PrincipalOAuth2User) authentication.getPrincipal();
        String email = principal.getUser().getEmail();
        
        // 세션에서 userType 확인
        HttpSession session = request.getSession();
        String userType = (String) session.getAttribute("oauth_userType");
        String redirectUri = request.getParameter("redirect_uri");
        boolean isHostLogin = "HOST".equals(userType) || (redirectUri != null && redirectUri.contains("/host/"));

        // 디버깅을 위한 로그 추가
        log.info("OAuth2 Success - Email: {}, UserType from session: {}, RedirectUri: {}, IsHostLogin: {}, IsNewUser: {}", 
                 email, userType, redirectUri, isHostLogin, principal.isNewUser());

        // 세션에서 userType 정보 제거
        if (userType != null) {
            session.removeAttribute("oauth_userType");
        }

        // 신규 사용자라면 회원가입 페이지로 리다이렉트
        if (principal.isNewUser()) {
            
            // 소셜로그인 신규 사용자의 이메일을 Redis에 인증된 상태로 저장
            String authCodeKey = "AuthCode " + email;
            redisService.setValues(authCodeKey, "SOCIAL_LOGIN_VERIFIED", java.time.Duration.ofMinutes(30));
            log.info("소셜로그인 신규 사용자 이메일 사전 인증 처리: {}", email);
            
            String signupUrl = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:3000")
                    .path(isHostLogin ? "/host/signup" : "/signup")
                    .queryParam("email", email)
                    .queryParam("msg", "최초 로그인은 회원가입이 필요합니다")
                    .build()
                    .encode()
                    .toUriString();

            log.info("Redirecting new user to: {}", signupUrl);
            response.sendRedirect(signupUrl);
            return;
        }

        // 기존 사용자: JWT 생성 후 프론트로 리다이렉트
        Long userId = principal.getUser().getId();
        String role = principal.getRole();
        String realName = principal.getUser().getUsername();
        String phone = principal.getPhoneNumber();

        // 호스트 로그인인데 일반 계정인 경우
        if (isHostLogin && !"HOST".equals(role)) {
            String signupUrl = UriComponentsBuilder
                    .fromHttpUrl("http://localhost:3000")
                    .path("/host/signup")
                    .queryParam("email", email)
                    .queryParam("msg", "호스트 계정으로 가입이 필요합니다")
                    .build()
                    .encode()
                    .toUriString();

            log.info("Redirecting existing non-host user to host signup: {}", signupUrl);
            response.sendRedirect(signupUrl);
            return;
        }

        String accessToken = jwtTokenProvider.generateAccessToken(userId, role);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId, role);

        // 성공 페이지로 리다이렉트
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

        log.info("Redirecting existing user to success page: {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}
