package com.likelion.loco_project.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * 요청 헤더의 JWT 토큰을 파싱하여 사용자를 인증하는 필터
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // Request Header에서 JWT 토큰 추출
            String token = resolveToken(request);

            // 토큰 유효성 검증
            if (token != null && jwtTokenProvider.validateToken(token)) {
                // 토큰에서 사용자 ID 및 역할 정보 추출
                Long userId = jwtTokenProvider.getUserIdFromToken(token);
                String role = jwtTokenProvider.getRoleFromToken(token);

                // Authentication 객체 생성
                // 여기서는 간단히 userId와 role만 사용. 실제 UserDetails 객체를 사용하는 것이 일반적
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

                // 인증 상세 정보 설정 (선택적)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Security Context에 Authentication 객체 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // 토큰 파싱 또는 검증 중 예외 발생 시
            // 클라이언트에게 403 Forbidden 응답 반환 (Spring Security가 처리하도록 함)
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    // Request Header에서 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 