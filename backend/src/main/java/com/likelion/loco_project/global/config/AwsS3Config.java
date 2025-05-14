package com.likelion.loco_project.global.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Slf4j
@Configuration
public class AwsS3Config {
    @Value("${cloud.aws.credentials.access-key}") // application.yml 명시
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName; // S3Service에서 사용할 버킷 이름 필드 추가

    /**
     * AWS S3 클라이언트 Bean을 정의 (AWS SDK for Java v2 사용)
     * @return 구성된 S3Client 객체
     */
    @Bean
    public S3Client s3Client() {
        // AWS Basic 자격 증명 생성 (Access Key와 Secret Key 사용)
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey); // ⭐ AWS SDK v2 클래스 사용

        StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(credentials);

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentialsProvider) // 자격 증명 제공자 설정
                .build();
    }
}
