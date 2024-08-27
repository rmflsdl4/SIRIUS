package com.culiso.culiso.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.culiso.culiso.dto.ContentListFileDTO;
import com.culiso.culiso.entity.ContentsEntity;

public interface ContentListRepository extends JpaRepository<ContentsEntity, Integer> {

    @Query("SELECT new com.culiso.culiso.dto.ContentListFileDTO(c.contents_num, c.contents_title, c.content, c.recommend, c.views, c.contents_date, b.board_name, null, null) " +
       "FROM BoardEntity b " +
       "JOIN ContentsEntity c ON b.board_id = c.board_id " +
       "JOIN ( " +
       "    SELECT b.board_name AS board_name, MAX(c.recommend + c.views) AS max_sum " +
       "    FROM BoardEntity b " +
       "    JOIN ContentsEntity c ON b.board_id = c.board_id " +
       "    GROUP BY b.board_name " +
       ") AS max_contents ON b.board_name = max_contents.board_name AND (c.recommend + c.views) = max_contents.max_sum " +
       "ORDER BY c.contents_date DESC")
    List<ContentListFileDTO> findMaxRecommendContent();

    @Query("SELECT new com.culiso.culiso.dto.ContentListFileDTO(c.contents_num, c.contents_title, c.content, c.recommend, c.views, c.contents_date, b.board_name, null, null) " +
           "FROM BoardEntity b " +
           "JOIN ContentsEntity c ON b.board_id = c.board_id " +
           "WHERE b.board_id = :board_id " +
           "ORDER BY c.contents_date DESC")
    List<ContentListFileDTO> findAllContentsByBoardId(@Param("board_id") int boardId);
}
