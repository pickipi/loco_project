package com.likelion.loco_project.global.oauth;

import com.likelion.loco_project.domain.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter
public class PrincipalOAuth2User implements OAuth2User {
    private final User user;
    private final Map<String, Object> attributes;
    private final boolean newUser;

    public PrincipalOAuth2User(User user, Map<String, Object> attributes, boolean newUser) {
        this.user = user;
        this.attributes = attributes;
        this.newUser = newUser;
    }

    @Override public Map<String, Object> getAttributes() { return attributes; }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return Collections.emptySet(); }
    @Override public String getName() { return user.getEmail(); }
    public boolean isNewUser() { return newUser; }
    public String getRole() { return user.getUserType().name(); }
    public String getPhoneNumber() { return user.getPhoneNumber(); }
}
