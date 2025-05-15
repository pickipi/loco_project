package com.likelion.loco_project.global.jwt;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.global.jwt.JwtProvider;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtProvider jwtProvider;

    public JwtHandshakeInterceptor(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        // 요청 헤더에서 토큰 추출 (또는 query param에서도 가능)
        String token = ((ServletServerHttpRequest) request).getServletRequest()
                .getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            if (jwtProvider.validateToken(token)) {
                // 토큰에서 사용자 정보 추출 후 저장
                User user = jwtProvider.getUserFromToken(token);
                attributes.put("user", user);
                return true;
            }
        }

        return false; // 인증 실패
    }

    @Override
    public void afterHandshake(ServerHttpRequest request
            , ServerHttpResponse response
            , WebSocketHandler wsHandler
            , Exception exception) {
    }
}