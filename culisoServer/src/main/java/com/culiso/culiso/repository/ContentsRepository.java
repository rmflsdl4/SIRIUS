package com.culiso.culiso.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.culiso.culiso.entity.ContentsEntity;

import jakarta.transaction.Transactional;

public interface ContentsRepository extends JpaRepository<ContentsEntity, Integer> {
    // 추천 수 증가 쿼리
    @Modifying
    @Transactional
    @Query("UPDATE ContentsEntity contents SET contents.recommend = contents.recommend + 1 WHERE contents.contents_num = :contents_num")
    int plusRecommendHandle(@Param("contents_num") int contents_num);

    // 추천 수 감소 쿼리
    @Modifying
    @Transactional
    @Query("UPDATE ContentsEntity contents SET contents.recommend = contents.recommend - 1 WHERE contents.contents_num = :contents_num")
    int minusRecommendHandle(@Param("contents_num") int contents_num);

    // 게시글 삭제 쿼리
    @Modifying
    @Transactional
    @Query("DELETE FROM ContentsEntity contents WHERE contents.contents_num = :contents_num")
    int contentsDeleteHandle(
        @Param("contents_num") int contents_num
    );

    // 컨텐츠 추천 수 조회 쿼리
    @Query("SELECT contents.recommend FROM ContentsEntity contents WHERE contents.contents_num = :contents_num")
    int contentsRecommendSelectHandle(@Param("contents_num") int contents_num);

    // 조회수 증가 쿼리
    @Modifying
    @Transactional
    @Query("UPDATE ContentsEntity contents SET contents.views = contents.views + 1 WHERE contents.contents_num = :contents_num")
    int viewsCountHandle(@Param("contents_num") int contents_num);
}
