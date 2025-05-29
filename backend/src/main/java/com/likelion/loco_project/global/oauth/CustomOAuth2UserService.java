package com.likelion.loco_project.global.oauth;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.entity.UserType;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import com.likelion.loco_project.domain.user.service.UserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // 카카오 응답에서 이메일·닉네임 추출
        @SuppressWarnings("unchecked")
        Map<String, Object> kakaoAccount = (Map<String,Object>)oauth2User.getAttributes().get("kakao_account");
        String email = (String) kakaoAccount.get("email");
        @SuppressWarnings("unchecked")
        String nickname = (String)((Map<String,Object>)kakaoAccount.get("profile")).get("nickname");

        // DB에 이미 가입된 유저인지 확인
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isPresent()) {
            // 기존 사용자
            return new PrincipalOAuth2User(opt.get(), oauth2User.getAttributes(), false);
        } else {
            // 신규 사용자 (DB에는 저장하지 않고, signup 화면으로만 보냄)
            User dummy = User.builder()
                    .email(email)
                    .username(nickname)
                    .build();
            return new PrincipalOAuth2User(dummy, oauth2User.getAttributes(), true);
        }
    }
}

