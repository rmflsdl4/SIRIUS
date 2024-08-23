package com.culiso.culiso.repository;

import com.culiso.culiso.entity.FileEntity;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FileRepository extends JpaRepository<FileEntity, Integer> {
    
    @Query(value = "SELECT * FROM file f WHERE f.contents_num = :contents_num ORDER BY f.file_upload_num ASC LIMIT 1", nativeQuery = true)
    Optional<FileEntity> findFirstByContentsNumOrderByFileUploadNumAsc(@Param("contents_num") int contents_num);


    // 파일 삽입
    @Modifying
    @Transactional
    @Query("INSERT INTO FileEntity file (file_url, file_name, user_id, contents_num) VALUES (:file_url, :file_name, :user_id, :contents_num) ")
    void fileInsertHandle(
        @Param("file_url") String file_url,
        @Param("file_name") String file_name,
        @Param("user_id") String user_id,
        @Param("contents_num") int contents_num
        );
}
