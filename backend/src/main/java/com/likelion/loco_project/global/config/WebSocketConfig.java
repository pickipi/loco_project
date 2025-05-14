package com.likelion.loco_project.global.config;

import com.likelion.loco_project.global.jwt.JwtHandshakeInterceptor;
import com.likelion.loco_project.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtProvider jwtProvider;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .addInterceptors(new JwtHandshakeInterceptor(jwtProvider))
                .setAllowedOriginPatterns("*")  // 운영 시 도메인 제한 권장
                .withSockJS();  // 또는 .withoutSockJS()
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // 클라이언트 구독 주소
        registry.setApplicationDestinationPrefixes("/app"); // 서버 수신 주소
    }
}