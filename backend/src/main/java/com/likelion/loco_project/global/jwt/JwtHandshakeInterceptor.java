package com.likelion.loco_project.global.jwt;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import java.util.Map;

/**
 * WebSocket 핸드셰이크 시점에 JWT를 검증하고,
 * 유효 시 attributes에 userId와 role을 담아 두는 인터셉터
 */
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public JwtHandshakeInterceptor(JwtTokenProvider jwtTokenProvider,
                                   UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {
        // "Authorization" 헤더에서 Bearer 토큰 추출
        String authHeader = ((ServletServerHttpRequest) request)
                .getServletRequest()
                .getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                // 토큰에서 userId, role을 꺼내고
                Long userId = jwtTokenProvider.getUserIdFromToken(token);
                String role = jwtTokenProvider.getRoleFromToken(token);

                // (선택) User 엔티티가 필요하면 조회
                User user = userRepository.findById(userId)
                        .orElse(null);

                // attributes에 담아서 이후 WebSocketHandler에서 사용
                attributes.put("userId", userId);
                attributes.put("role", role);
                attributes.put("user", user);
                return true;
            }
        }
        // 인증 실패 시 연결 차단
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // 별도 처리 없음
    }
}
