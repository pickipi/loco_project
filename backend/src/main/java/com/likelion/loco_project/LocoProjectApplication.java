package com.likelion.loco_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing // JPA Auditing 활성화 (생성일자, 수정일자 자동 관리)
@SpringBootApplication
public class LocoProjectApplication {
	public static void main(String[] args) {
		SpringApplication.run(LocoProjectApplication.class, args);
	}

}
