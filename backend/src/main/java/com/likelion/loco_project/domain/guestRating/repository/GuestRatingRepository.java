package com.likelion.loco_project.domain.guestRating.repository;

import com.likelion.loco_project.domain.guest.entity.Guest;
import com.likelion.loco_project.domain.guestRating.entity.GuestRating;
import com.likelion.loco_project.domain.host.entity.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface GuestRatingRepository extends JpaRepository<GuestRating, Long> {
    Optional<GuestRating> findByHostAndGuest(Host host, Guest guest);
    List<GuestRating> findAllByGuest(Guest guest);

    @Query("SELECT AVG(gr.score) FROM GuestRating gr WHERE gr.guest.id = :guestId")
    Double findAverageScoreByGuestId(@Param("guestId") Long guestId);

}
