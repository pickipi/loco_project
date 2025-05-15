package com.likelion.loco_project.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KakaoMapConfig {

    @Value("${kakao.map.javascript-key}")
    private String kakaoMapKey;

    public String getKakaoMapKey() {
        return kakaoMapKey;
    }
}