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
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        // S3 버킷 내 객체 키 생성 (디렉토리 경로 + 파일 이름)
        String s3ObjectKey = s3UploadDir + storedFileName;

        try {
            // S3 PutObjectRequest 생성
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName) // 버킷 이름 설정
                    .key(s3ObjectKey) // 객체 키 설정 (S3에 저장될 경로/파일명)
                    .contentType(file.getContentType()) // 파일 타입 설정
                    .contentLength(file.getSize()) // 파일 크기 설정
                    .build();

            // S3에 파일 업로드 실행
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // 업로드 성공 시 S3 객체 키 반환
            return s3ObjectKey;

        } catch (S3Exception e) {
            // S3 관련 예외 처리
            throw new RuntimeException("파일을 S3에 업로드하는 것이 실패했습니다. : " + e.getMessage(), e);
        } catch (IOException e) {
            // 파일 스트림 처리 예외
            throw new RuntimeException("파일을 읽는 것에 실패했습니다. : " + e.getMessage(), e);
        }
    }

    /** 파일 삭제 방식 - S3 객체 삭제
     * 지정된 S3 객체 키에 해당하는 파일을 S3 버킷에서 삭제
     * @param s3ObjectKey 삭제할 S3 객체 키
     * @throws RuntimeException 파일 삭제 실패 시 발생
     */
    public void deleteFile(String s3ObjectKey) {
        try {
            // S3 DeleteObjectRequest 생성
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName) // 버킷 이름 설정
                    .key(s3ObjectKey) // 삭제할 객체 키 설정
                    .build();

            // S3 객체 삭제 실행
            s3Client.deleteObject(deleteObjectRequest);

        } catch (S3Exception e) {
            System.err.println("S3 데이터를 삭제하는데 실패했습니다. : " + s3ObjectKey + " - " + e.getMessage());
        }
    }
}
