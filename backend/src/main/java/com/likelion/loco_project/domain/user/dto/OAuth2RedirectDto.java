package com.likelion.loco_project.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OAuth2RedirectDto {
    private String email;
    private String signupRedirect;
    private String userType;
    private String msg;

    public OAuth2RedirectDto(String email, String signupRedirect, String userType, String msg) {
        this.email = email;
        this.signupRedirect = signupRedirect;
        this.userType = userType;
        this.msg = msg;
    }

    public String buildRedirectUrl() {
        return signupRedirect + "?email=" + email + "&msg=" + msg;
    }
} 