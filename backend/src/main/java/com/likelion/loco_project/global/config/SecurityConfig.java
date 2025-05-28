package com.likelion.loco_project.global.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.likelion.loco_project.global.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * SecurityFilterChain Bean을 정의하여 HTTP 보안 설정을 구성
     * @param http HttpSecurity 객체
     * @return 구성된 SecurityFilterChain 객체
     * @throws Exception 보안 설정 중 발생할 수 있는 예외
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 스프링 시큐리티 단계에서 CORS 허용
                .cors().and()

                // CSRF 완전히 비활성화 (REST API는 보통 disable)
                .csrf(AbstractHttpConfigurer::disable)

                // HTTP 요청에 대한 인가(Authorization) 설정
                .authorizeHttpRequests(authorize -> authorize
                        // H2 콘솔 경로는 모든 사용자에게 접근을 허용
                        .requestMatchers("/h2-console/**").permitAll()

                        // 회원가입 및 로그인 엔드포인트는 인증 없이도 허용
                        .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()

                        // Swagger UI 관련 경로도 인증 없이 접근 가능하도록 설정
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // 이미지 업로드 관련 엔드포인트 허용
                        .requestMatchers(HttpMethod.POST, "/api/v1/spaces/images/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/spaces/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/spaces/**").permitAll()

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                // H2 콘솔의 프레임 표시를 허용
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.sameOrigin())
                )

                // 기본 폼 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable)

                // 기본 HTTP Basic 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable)

                // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 이전에 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

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