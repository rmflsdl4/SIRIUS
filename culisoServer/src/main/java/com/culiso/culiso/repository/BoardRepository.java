package com.culiso.culiso.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.culiso.culiso.entity.BoardEntity;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    @Query("SELECT board_id, board_name FROM BoardEntity b WHERE b.board_read = 'A' OR b.board_read = 'U'")
    List<BoardEntity> boardMenuHandler();
} 
