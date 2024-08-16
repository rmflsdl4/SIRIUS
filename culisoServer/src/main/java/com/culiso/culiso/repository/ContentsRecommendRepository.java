package com.culiso.culiso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.culiso.culiso.entity.ContentsRecommendEntity;
import com.culiso.culiso.entity.ContentsRecommendId;

import jakarta.transaction.Transactional;

public interface ContentsRecommendRepository extends JpaRepository<ContentsRecommendEntity, ContentsRecommendId> {
    
    // contentsRecommend 테이블에 새로운 추천 기록 삽입
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO contentsrecommend (user_id, contents_num) VALUES(:user_id, :contents_num)", nativeQuery = true)
    int insertContentsRecommendHandle(@Param("user_id") String user_id, @Param("contents_num") int contents_num);

    // contentsRecommend 테이블에 새로운 추천 기록 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM ContentsRecommendEntity cr WHERE cr.id.user_id = :user_id AND cr.id.contents_num = :contents_num")
    int deleteContentsRecommendHandle(@Param("user_id") String user_id, @Param("contents_num") int contents_num);
}
