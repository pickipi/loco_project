package com.likelion.loco_project.domain.reservation.dto;

import com.likelion.loco_project.domain.reservation.entity.Reservation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AdminReservationResponseDto {
    private Long id;
    private String userName;
    private String spaceName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer totalPrice;
    private Reservation.ReservationStatus status;
    private Reservation.PaymentStatus paymentStatus;

    public static AdminReservationResponseDto from(Reservation reservation) {
        AdminReservationResponseDto dto = new AdminReservationResponseDto();
        dto.setId(reservation.getId());
        dto.setUserName(reservation.getUser().getUsername());
        dto.setSpaceName(reservation.getSpace().getSpaceName());
        dto.setStartTime(reservation.getStartTime());
        dto.setEndTime(reservation.getEndTime());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus());
        dto.setPaymentStatus(reservation.getPaymentStatus());
        return dto;
    }
} 