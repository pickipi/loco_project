package com.likelion.loco_project.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // CSRF 설정 시 필요
import org.springframework.security.web.SecurityFilterChain;

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

                // HTTP 요청에 대한 인가(Authorization) 설정
                .authorizeHttpRequests(authorize -> authorize
                        // 모든 요청 ("/**")에 대해 인증 없이 접근을 허용
                        .anyRequest().permitAll()
                )

                // 기본 폼 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable)

                // 기본 HTTP Basic 인증 비활성화
                .httpBasic(AbstractHttpConfigurer::disable);

        // 설정된 HttpSecurity 객체를 기반으로 SecurityFilterChain 객체 생성 및 반환
        return http.build();
    }

    // TODO: 비밀번호 암호화에 사용할 PasswordEncoder Bean 정의 (로그인/회원가입 기능 구현 시 필요)
    // TODO: 인증 관리자 AuthenticationManager Bean 정의 (로그인 로직 구현 시 필요)
}
