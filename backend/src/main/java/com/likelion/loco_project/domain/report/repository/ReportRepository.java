package com.likelion.loco_project.domain.report.repository;

import com.likelion.loco_project.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
