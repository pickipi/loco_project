package com.likelion.loco_project.domain.guestRating.entity;

import com.likelion.loco_project.domain.guest.Guest;
import com.likelion.loco_project.domain.host.Host;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private Host host;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = false)
    private Guest guest;

    @Column(nullable = false)
    private int rating; // 1 ~ 10

    public void updateRating(int rating) {
        this.rating = rating;
    }
}
