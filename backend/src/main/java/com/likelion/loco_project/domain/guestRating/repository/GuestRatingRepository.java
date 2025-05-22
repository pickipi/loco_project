package com.likelion.loco_project.domain.guestRating.repository;

import com.likelion.loco_project.domain.guest.Guest;
import com.likelion.loco_project.domain.guestRating.entity.GuestRating;
import com.likelion.loco_project.domain.host.Host;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface GuestRatingRepository extends JpaRepository<GuestRating, Long> {
    Optional<GuestRating> findByHostAndGuest(Host host, Guest guest);
    List<GuestRating> findAllByGuest(Guest guest);
}
