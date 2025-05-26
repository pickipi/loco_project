package com.likelion.loco_project.domain.user.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoAuthService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.oauth.redirect.uri}")
    private String redirectUri;

    public String getAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kauth.kakao.com/oauth/token",
                    HttpMethod.POST,
                    kakaoTokenRequest,
                    String.class
            );

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            if (jsonNode.has("error")) {
                String errorCode = jsonNode.get("error").asText();
                String errorDescription = jsonNode.has("error_description") ? 
                    jsonNode.get("error_description").asText() : "Unknown error";
                log.error("Kakao token error: {} - {}", errorCode, errorDescription);
                throw new RuntimeException("Failed to get Kakao access token: " + errorDescription);
            }
            return jsonNode.get("access_token").asText();
        } catch (Exception e) {
            log.error("Error getting Kakao access token", e);
            throw new RuntimeException("Failed to get Kakao access token", e);
        }
    }

    public KakaoUserInfo getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    kakaoUserInfoRequest,
                    String.class
            );

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            if (jsonNode.has("error")) {
                String errorCode = jsonNode.get("error").asText();
                String errorDescription = jsonNode.has("error_description") ? 
                    jsonNode.get("error_description").asText() : "Unknown error";
                log.error("Kakao user info error: {} - {}", errorCode, errorDescription);
                throw new RuntimeException("Failed to get Kakao user info: " + errorDescription);
            }

            JsonNode kakaoAccount = jsonNode.get("kakao_account");
            JsonNode profile = kakaoAccount.get("profile");

            return KakaoUserInfo.builder()
                    .id(jsonNode.get("id").asLong())
                    .email(kakaoAccount.get("email").asText())
                    .nickname(profile.get("nickname").asText())
                    .build();
        } catch (Exception e) {
            log.error("Error getting Kakao user info", e);
            throw new RuntimeException("Failed to get Kakao user info", e);
        }
    }

    @lombok.Builder
    @lombok.Getter
    public static class KakaoUserInfo {
        private final Long id;
        private final String email;
        private final String nickname;
    }
} 