package com.likelion.loco_project.domain.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.util.UUID;

// AWS S3 관련 비즈니스 로직을 처리하는 서비스 (=S3 관련 작업 (업로드, 삭제 등))
@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    // 이미지 파일을 저장할 S3 버킷 내의 기본 디렉토리
    private final String s3UploadDir = "global/data/image/";

    /** 파일 업로드 방식 - Multipart 사용
     * MultipartFile -> AWS S3 업로드 -> S3 객체 키를 반환
     * @param file 업로드할 MultipartFile 객체
     * @return S3에 저장된 객체의 키 (버킷 내 경로/파일명)
     * @throws RuntimeException 파일 업로드 실패 시 발생
     */
    public String uploadFile(MultipartFile file) {
        // 파일 이름 생성 (중복 방지를 위해 UUID 사용)
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + extension;

        // S3 버킷 내 객체 키 생성 (디렉토리 경로 + 파일 이름)
        String s3ObjectKey = s3UploadDir + storedFileName;

        try {
            // S3 PutObjectRequest 생성
            PutObjectRequest por = PutObjectRequest.builder()
                    .bucket(bucketName) // 버킷 이름 설정
                    .key(s3ObjectKey) // 객체 키 설정 (S3에 저장될 경로/파일명)
                    .contentType(file.getContentType()) // 파일 타입 설정
                    .contentLength(file.getSize()) // 파일 크기 설정
                    .build();
            // S3에 파일 업로드 실행
            s3Client.putObject(por, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // 업로드 성공 시 S3 객체 키 반환
            // 절대 URL 생성
            return String.format(
                    "https://%s.s3.%s.amazonaws.com/%s",
                    bucketName,
                    region,
                    s3ObjectKey
            );

        } catch (S3Exception | IOException e) {
            // S3 관련 예외 처리
            throw new RuntimeException("S3 업로드 실패: " + e.getMessage(), e);
        }
    }

    /** 파일 삭제 방식 - S3 객체 삭제
     * 지정된 S3 객체 키에 해당하는 파일을 S3 버킷에서 삭제
     * @param fileUrl 삭제할 S3 객체 키
     * @throws RuntimeException 파일 삭제 실패 시 발생
     */
    public void deleteFile(String fileUrl) {
        // fileUrl 이 절대 URL 이므로 key 만 분리해서 삭제
        String key = fileUrl
                .replaceFirst("^https?://[^/]+/", "");
        try {
            DeleteObjectRequest dor = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.deleteObject(dor);
        } catch (S3Exception e) {
            // 로깅만
            System.err.println("S3 삭제 실패: " + key + " - " + e.getMessage());
        }
    }
}
