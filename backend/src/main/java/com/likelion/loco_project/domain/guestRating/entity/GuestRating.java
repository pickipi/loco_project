package com.likelion.loco_project.domain.guestRating.entity;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.host.entity.Host;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GuestRating {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //평점을 부여한 호스트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private Host host;

    //평점을 받은 게스트
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    //평점: 1 ~ 10
    @Column(nullable = false)
    private int rating;

    private int score;

    public void updateRating(int rating) {
        this.rating = rating;
    }
}
