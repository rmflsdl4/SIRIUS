package com.culiso.culiso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.culiso.culiso.entity.CommentEntity;
import com.culiso.culiso.dto.CommentDTO;

import jakarta.transaction.Transactional;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {

    @Modifying
    @Transactional
    @Query("INSERT INTO CommentEntity comment (comment_content, user_id, contents_num) VALUES (:comment_content, :user_id, :contents_num)")
    int commentInsertHandle(
        @Param("comment_content") String comment_content, 
        @Param("user_id") String user_id,
        @Param("contents_num") int contents_num
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM CommentEntity comment WHERE comment.comment_num = :comment_num")
    int commentDeleteHandle(
        @Param("comment_num") int comment_num
    );

    @Query("SELECT new com.culiso.culiso.dto.CommentDTO(c.comment_num, c.comment_content, c.comment_date, u.user_id, u.user_name, u.user_nick, u.profile_url) " +
           "FROM CommentEntity c " +
           "JOIN UserEntity u ON c.user_id = u.user_id " +
           "WHERE c.contents_num = :contents_num")
    List<CommentDTO> commentSelectHandle(@Param("contents_num") int contents_num);
}
