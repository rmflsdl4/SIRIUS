package com.culiso.culiso.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.culiso.culiso.dto.BoardMenuDTO;
import com.culiso.culiso.entity.BoardEntity;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    @Query("SELECT BoardMenuDTO(board.board_id, board.board_name) FROM BoardEntity board WHERE board.board_read = 'A' OR board.board_read = 'U'")
    List<BoardMenuDTO> boardMenuHandler();
} 
