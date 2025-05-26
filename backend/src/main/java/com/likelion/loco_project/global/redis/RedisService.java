package com.likelion.loco_project.global.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final StringRedisTemplate stringRedisTemplate;

    // 값 저장
    public void setValues(String key, String value, Duration timeout) {
        ValueOperations<String, String> values = stringRedisTemplate.opsForValue();
        values.set(key, value, timeout);
    }

    // 값 조회
    public String getValues(String key) {
        ValueOperations<String, String> values = stringRedisTemplate.opsForValue();
        return values.get(key);
    }

    // 값 존재 여부 확인
    public boolean checkExistsValue(String value) {
        return value != null;
    }

    // 값 삭제
    public void deleteValues(String key) {
        stringRedisTemplate.delete(key);
    }
}