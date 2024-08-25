package com.culiso.culiso.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImgService {

    private final String uploadDir;

    public ImgService(@Value("${file.upload-dir}") String uploadDir) {
        // Spring Boot의 파일 경로는 상대 경로일 경우 프로젝트 루트를 기준으로 동작합니다.
        // 절대 경로로 변환하여 사용하도록 처리
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().toString();
    }

    public List<String> saveImages(String user_id, List<MultipartFile> images) throws IOException {
        // 이미지 파일을 저장할 디렉토리 경로 설정 (user_id 별로 디렉토리를 생성)
        String userUploadDir = Paths.get(uploadDir, user_id).toString();

        // 디렉토리가 존재하지 않으면 생성
        Path dirPath = Paths.get(userUploadDir);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);  // 상위 디렉토리까지 포함해서 모두 생성
        }

        List<String> savedFileNames = new ArrayList<>();

        // 이미지를 지정된 경로에 저장
        for (MultipartFile image : images) {
            try {
                // 파일 확장자 추출
                String extension = getFileExtension(image.getOriginalFilename());
                
                // 고유한 파일 이름 생성
                String uniqueFileName = UUID.randomUUID().toString() + "." + extension;

                // 파일 저장 경로 설정
                Path filePath = dirPath.resolve(uniqueFileName);
                
                // 파일 저장
                Files.copy(image.getInputStream(), filePath);
                System.out.println("Saved image: " + filePath.toAbsolutePath());

                // 저장된 파일 이름을 리스트에 추가
                savedFileNames.add(uniqueFileName);
            } catch (IOException e) {
                System.err.println("Error saving file: " + image.getOriginalFilename());
                e.printStackTrace();
            }
        }

        return savedFileNames;
    }

    // 이미지 파일 삭제
    public void deleteImages(String user_id, List<String> del_img_names) {
        String user_upload_dir = Paths.get(uploadDir, user_id).toString();

        for (String file_name : del_img_names) {
            Path file_path = Paths.get(user_upload_dir, file_name);
            try {
                Files.deleteIfExists(file_path);
            } catch (IOException e) {
                System.err.println("Failed to delete file: " + file_path.toString());
                e.printStackTrace();
            }
        }
    }

    // 파일 확장자 추출 메서드
    private String getFileExtension(String fileName) {
        String extension = "";

        int i = fileName.lastIndexOf('.');
        if (i > 0) {
            extension = fileName.substring(i + 1);
        }
        return extension;
    }
}