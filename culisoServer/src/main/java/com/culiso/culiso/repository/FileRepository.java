package com.culiso.culiso.repository;

import com.culiso.culiso.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FileRepository extends JpaRepository<FileEntity, Integer> {
    
    @Query("SELECT f FROM FileEntity f WHERE f.contents_num = :contents_num ORDER BY f.file_upload_num ASC")
    Optional<FileEntity> findFirstByContentsNumOrderByFileUploadNumAsc(@Param("contents_num") int contents_num);
}
