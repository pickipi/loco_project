package com.likelion.loco_project.domain.auth;

import com.likelion.loco_project.domain.mail.mail.service.MailService;
import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.entity.UserType;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.global.exception.BusinessLogicException;
import com.likelion.loco_project.global.exception.ExceptionCode;
import com.likelion.loco_project.global.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailAuthManager {

    private static final String AUTH_CODE_PREFIX = "AuthCode ";

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final RedisService redisService;

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    public void sendAuthCode(String email) {
        // 이미 존재하는 회원인지 검사
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_EXISTS);
        }
        // 인증코드 생성 및 전송
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

    public void sendTemporaryPassword(String toEmail, String tempPassword) {
        String subject = "[LoCo] 임시 비밀번호 안내";
        String body = "임시 비밀번호는 " + tempPassword + " 입니다.\n" +
                "로그인 후 반드시 비밀번호를 변경해주세요.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void resetPasswordByEmail(String email, UserType expectedType) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        //유저 타임
        if (!user.getUserType().equals(expectedType)) {
            throw new BusinessLogicException(ExceptionCode.USER_TYPE_NOT_MATCH);
        }

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.changePassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        sendTemporaryPassword(email, tempPassword);
    }
}