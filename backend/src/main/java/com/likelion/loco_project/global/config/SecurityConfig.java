package com.likelion.loco_project.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    /**
     * SecurityFilterChain Bean을 정의하여 HTTP 보안 설정을 구성
     * @param http HttpSecurity 객체
     * @return 구성된 SecurityFilterChain 객체
     * @throws Exception 보안 설정 중 발생할 수 있는 예외
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF(Cross-Site Request Forgery) 보호 비활성화
                .csrf(AbstractHttpConfigurer::disable)

                // H2 콘솔 경로에 대한 CSRF 보호 비활성화
                .csrf(csrf -> csrf
                    .ignoringRequestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**"))
                )

                // HTTP 요청에 대한 인가(Authorization) 설정
                .authorizeHttpRequests(authorize -> authorize
                        // H2 콘솔 경로는 모든 사용자에게 접근을 허용
                        .requestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**")).permitAll()

                        // ⭐ /api/v1/users 에 대한 POST 요청은 인증 없이도 허용
                        .requestMatchers(HttpMethod.POST, "/api/v1/users").permitAll()

                        // Swagger UI 관련 경로도 인증 없이 접근 가능하도록 설정
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // 모든 요청 ("/**")에 대해 인증 없이 접근을 허용
                        .anyRequest().permitAll()
//                        .anyRequest().authenticated() // 허용한 경로 외의 모든 요청은 인증 필요 (기본 설정)
                )

                // H2 콘솔의 프레임 표시를 허용하도록 설정
                // Spring Security가 기본적으로 X-Frame-Options 헤더를 DENY로 설정하는 것을 재정의
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions
                                .sameOrigin()
                        )
                )

                // 기본 폼 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable)

                // 기본 HTTP Basic 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable);

        // 설정된 HttpSecurity 객체를 기반으로 SecurityFilterChain 객체 생성 및 반환
        return http.build();
    }
}
