package com.likelion.loco_project.global.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * 인증된 사용자 정보를 담는 SecurityUser 객체
 */
@Getter
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private final String id; // 사용자 ID (보통 Long 타입이지만 문자열로 처리)
    private final String email;
    private final String username;
    private final List<GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // 인증 관련 필드 (비밀번호 등은 사용하지 않는다면 null 또는 빈 값 가능)
    @Override
    public String getPassword() {
        return null; // 비밀번호 필요 없을 경우 null
    }

    @Override
    public String getUsername() {
        return id; // 여기서는 userId를 username으로 간주 (ex. Long -> String)
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // 계정 만료 여부
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // 계정 잠금 여부
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 자격 증명 만료 여부
    }

    @Override
    public boolean isEnabled() {
        return true; // 계정 활성화 여부
    }
}