package com.likelion.loco_project.global.config;

import java.util.List;

import com.likelion.loco_project.global.oauth.CustomOAuth2UserService;
import com.likelion.loco_project.global.oauth.OAuth2AuthenticationSuccessHandler;
import com.likelion.loco_project.global.security.JwtAuthenticationFilter;
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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.RequestMatcher;

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
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1) CORS 설정 (CorsFilter는 addFilterBefore로 명시적으로 추가하여 순서 제어)
            .cors(AbstractHttpConfigurer::disable)

            // 2) CSRF 비활성화 (REST API)
            .csrf(AbstractHttpConfigurer::disable)

            // CorsFilter를 Spring Security 필터 체인 맨 앞에 추가
            .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)

            // JWT 인증 필터 추가: CorsFilter 이후, UsernamePasswordAuthenticationFilter 이전에 실행
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // 3) 인가 설정
            .authorizeHttpRequests(authorize -> authorize
                // 공간 목록 조회 (GET /api/v1/spaces)는 모두 허용
                .requestMatchers(HttpMethod.GET, "/api/v1/spaces").permitAll()
                // 공간 목록 조회 (GET /api/v1/spaces/all)는 모두 허용
                .requestMatchers(HttpMethod.GET, "/api/v1/spaces/all").permitAll()
                // 공간 상세 조회 (GET /api/v1/spaces/{id})는 인증된 사용자만 접근 가능
                .requestMatchers(HttpMethod.GET, "/api/v1/spaces/{id}").authenticated()
                // 공간 검색 (GET /api/v1/spaces/search)는 모두 허용
                .requestMatchers(HttpMethod.GET, "/api/v1/spaces/search").permitAll()
                // OPTIONS 요청은 모든 경로에 대해 허용 (CORS Preflight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // H2 콘솔
                .requestMatchers("/h2-console/**").permitAll()
                // 회원가입·로그인 API
                .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/users/emails/**").permitAll()
                // 호스트 관련 공개 엔드포인트
                .requestMatchers("/api/v1/host/signup", "/api/v1/host/login").permitAll()
                .requestMatchers("/api/v1/host/oauth2/**").permitAll()
                // Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // OAuth2 로그인 엔드포인트
                .requestMatchers("/oauth2/authorization/**", "/login/oauth2/code/**", "/login").permitAll()
                // 호스트 전용 OAuth2 엔드포인트 추가
                .requestMatchers("/host/oauth2/authorization/**").permitAll()
                // 관리자 사용자 목록 조회는 인증된 사용자에게 허용
                .requestMatchers(HttpMethod.GET, "/api/v1/admin/users").authenticated()
                // 사용자 권한 변경 API는 인증된 사용자에게 허용
                .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/users/{userId}/role").authenticated()
                // 호스트 전용 엔드포인트는 HOST 권한 필요
                .requestMatchers("/api/v1/host/**").hasRole("HOST")
                // 예약 페이지는 인증된 사용자만 접근 가능
                .requestMatchers("/reservation").authenticated()
                // 호스트 채팅 페이지는 인증된 사용자만 접근 가능
                .requestMatchers("/host/chat").authenticated()
                // 나머지는 인증 필요
                .anyRequest().authenticated()
            )

            // 미인증 REST 호출에 대해 302 대신 401 응답
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)

            // 4) H2 iframe 허용
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

            // 5) 폼로그인·기본 Basic 비활성화
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

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
