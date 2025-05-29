package com.likelion.loco_project.global.config;

import java.util.List;

import com.likelion.loco_project.global.oauth.CustomOAuth2UserService;
import com.likelion.loco_project.global.oauth.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    /**
     * SecurityFilterChain Bean을 정의하여 HTTP 보안 설정을 구성
     * @param http HttpSecurity 객체
     * @return 구성된 SecurityFilterChain 객체
     * @throws Exception 보안 설정 중 발생할 수 있는 예외
     */
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler successHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) CORS 설정
                .cors().and()

                // 2) CSRF 비활성화 (REST API)
                .csrf(AbstractHttpConfigurer::disable)

                // 3) 인가 설정
                .authorizeHttpRequests(authorize -> authorize
                        // H2 콘솔
                        .requestMatchers("/h2-console/**").permitAll()
                        // 회원가입·로그인 API
                        .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/users/emails/**").permitAll()
                        // Swagger
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // OAuth2 로그인 엔드포인트
                        .requestMatchers("/oauth2/authorization/**", "/login/oauth2/code/**", "/login").permitAll()
                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )

                // 미인증 REST 호출에 대해 302 대신 401 응답
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                )
                .headers(headers -> headers.frameOptions().sameOrigin())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // 4) H2 iframe 허용
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

                // 5) 폼로그인·기본 Basic 비활성화
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .headers(h -> h.frameOptions().sameOrigin())
                // 6) OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        // 사용자 로그인 진입 페이지
                        .loginPage("/login")
                        // UserInfo 조회 서비스
                        .userInfoEndpoint(ui -> ui.userService(customOAuth2UserService))
                        // 로그인 성공 시 JWT 발급 후 리다이렉트
                        .successHandler(successHandler)
                        // 로그인 실패 시 처리
                        .failureHandler((req, res, ex) -> {
                            if (ex.getCause() instanceof OAuth2AuthorizationException oaex
                                    && "invalid_request".equals(oaex.getError().getErrorCode())) {
                                res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                                res.getWriter().write("잠시 후 다시 시도해주세요. (토큰 발급 한도 초과)");
                            } else {
                                res.sendRedirect("/oauth2/error");
                            }
                        })
                );

        return http.build();
    }

    /**
     * CORS 설정을 스프링 시큐리티 레이어에도 적용하기 위한 Bean
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(List.of("http://localhost:3000"));                  // 프론트엔드 주소 허용
        cors.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));   // 허용할 HTTP 메서드
        cors.setAllowedHeaders(List.of("*"));                                     // 모든 헤더 허용
        cors.setAllowCredentials(true);                                           // 인증 정보(Cookie 등) 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}
