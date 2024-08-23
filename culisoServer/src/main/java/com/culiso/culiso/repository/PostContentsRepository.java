package com.culiso.culiso.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.culiso.culiso.dto.CommentDTO;
import com.culiso.culiso.dto.FileDTO;
import com.culiso.culiso.dto.PostContentsDTO;
import com.culiso.culiso.entity.ContentsEntity;

public interface PostContentsRepository extends JpaRepository<ContentsEntity, Integer> {
    @Query("SELECT new com.culiso.culiso.dto.PostContentsDTO(" +
            "u.user_id, u.user_name, u.user_nick, u.create_date, u.profile_url, " +
            "c.contents_num, c.contents_title, c.content, c.recommend, c.contents_date, c.views, " +
            "b.board_id, b.board_name) " +
            "FROM ContentsEntity c " +
            "INNER JOIN UserEntity u ON c.user_id = u.user_id " +
            "INNER JOIN BoardEntity b ON c.board_id = b.board_id " +
            "WHERE c.contents_num = :contents_num")
            List<PostContentsDTO> getPostContents(@Param("contents_num") int contents_num);


    @Query("SELECT new com.culiso.culiso.dto.CommentDTO(" +
            "c.comment_num, c.comment_content, c.comment_date, " +
            "u.user_id, u.user_name, u.user_nick, u.profile_url) " +
            "FROM CommentEntity c " +
            "INNER JOIN UserEntity u ON c.user_id = u.user_id " +
            "WHERE c.contents_num = :contents_num")
    List<CommentDTO> getComments(@Param("contents_num") int contents_num);


    @Query("SELECT new com.culiso.culiso.dto.FileDTO(" +
            "f.file_upload_num, f.file_url, f.file_name) " +
            "FROM FileEntity f " +
            "WHERE f.contents_num = :contents_num")
    List<FileDTO> getFiles(@Param("contents_num") int contents_num);


    @Query("SELECT COUNT(cr) FROM ContentsRecommendEntity cr " +
           "WHERE cr.id.user_id = :user_id AND cr.id.contents_num = :contents_num")
    int countUserRecommend(@Param("contents_num") int contents_num, @Param("user_id") String sessionUserID);
}
