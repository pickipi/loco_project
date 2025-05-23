package com.likelion.loco_project.domain.auth;

import com.likelion.loco_project.domain.mail.mail.service.MailService;
import com.likelion.loco_project.global.exception.BusinessLogicException;
import com.likelion.loco_project.global.exception.ExceptionCode;
import com.likelion.loco_project.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailAuthManager {

    private static final String AUTH_CODE_PREFIX = "AuthCode ";

    private final MailService mailService;
    private final RedisService redisService;

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    public void sendAuthCode(String email) {
        String code = generateCode();
        String subject = "Loco 회원가입 이메일 인증 번호";
        mailService.sendEmail(email, subject, code);
        redisService.setValues(
                AUTH_CODE_PREFIX + email,
                code,
                Duration.ofMillis(authCodeExpirationMillis)
        );
    }

//    public boolean verifyCode(String email, String inputCode) {
//        String redisKey = AUTH_CODE_PREFIX + email;
//        String savedCode = redisService.getValues(redisKey);
//
//        log.info("savedCode = '{}', inputCode = '{}'", savedCode, inputCode);
//
//        // null 또는 빈 문자열 체크 추가
//        if (savedCode == null || savedCode.isBlank()) {
//            return false;
//        }
//
//        // null-safe 비교 (inputCode는 프론트에서 필수 입력이라 null 아님을 가정)
//        return savedCode.equals(inputCode.trim());
//    }

    public boolean verifyCode(String email, String inputCode) {
        String redisKey = AUTH_CODE_PREFIX + email;
        String savedCode = redisService.getValues(redisKey);

        log.info("savedCode = '{}', inputCode = '{}'", savedCode, inputCode);

        boolean exists = redisService.checkExistsValue(savedCode);
        boolean match = savedCode.trim().equals(inputCode.trim());

        log.info("exists = {}, match = {}", exists, match);

        return exists && match;
    }

    private String generateCode() {
        int length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < length; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error("EmailAuthManager.generateCode() error", e);
            throw new BusinessLogicException(ExceptionCode.NO_SUCH_ALGORITHM);
        }
    }

    public boolean isVerified(String email) {
        String key = AUTH_CODE_PREFIX + email;
        return redisService.checkExistsValue(redisService.getValues(key));
    }

}