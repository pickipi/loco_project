package com.likelion.loco_project.domain.guest.repository;

import com.likelion.loco_project.domain.guest.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {
}
