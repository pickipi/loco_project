package com.likelion.loco_project.global.rq;

import com.likelion.loco_project.domain.user.entity.User;
import com.likelion.loco_project.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Rq {

    private final HttpServletRequest request;
    private final UserRepository userRepository;

    /**
     * 로그인한 유저 정보 반환 (없으면 null)
     */
    public User getActor() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal == null || principal.equals("anonymousUser")) {
            return null;
        }

        String username;

        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = principal.toString();
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저 정보를 찾을 수 없습니다."));
    }

    /**
     * 로그인한 유저의 ID 반환 (없으면 예외)
     */
    public Long getActorId() {
        User actor = getActor();
        if (actor == null) throw new RuntimeException("로그인된 사용자가 없습니다.");
        return actor.getId();
    }
}