package com.culiso.culiso.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.culiso.culiso.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String>{
    @Query("SELECT count(user) FROM UserEntity user WHERE user.userID = :id AND user.userPW = :pw")
    Optional<Long> loginHandler(@Param("id") String id, @Param("pw") String pw);
    
}
