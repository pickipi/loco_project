package com.likelion.loco_project.domain.space.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/placeholder.svg")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PlaceholderImageController {

    @GetMapping
    public ResponseEntity<Resource> getPlaceholderImage(
            @RequestParam(defaultValue = "300") int width,
            @RequestParam(defaultValue = "200") int height) {
        try {
            // 기본 placeholder 이미지 반환
            Resource resource = new ClassPathResource("static/images/placeholder.svg");
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("image/svg+xml"))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
