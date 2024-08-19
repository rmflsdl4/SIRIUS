package com.culiso.culiso.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.culiso.culiso.dto.UserInformationDTO;
import com.culiso.culiso.entity.UserEntity;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String>{
    @Query("SELECT count(user) FROM UserEntity user WHERE user.user_id = :id AND user.user_pw = :pw")
    Optional<Long> loginHandler(@Param("id") String id, @Param("pw") String pw);

    @Modifying
    @Transactional
    @Query("INSERT INTO UserEntity user (user_id, user_pw, user_name, user_phone, post, address, sex, user_nick, adminID) VALUES (:id, :pw, :name, :phone, :post, :address, :sex, :nickName, 'admin')")
    int signUpHandler(
        @Param("id") String id, 
        @Param("pw") String pw,
        @Param("name") String name,
        @Param("phone") String phone,
        @Param("post") String post,
        @Param("address") String address,
        @Param("sex") String sex,
        @Param("nickName") String nickName
    );

    @Query("SELECT new com.culiso.culiso.dto.UserInformationDTO(user.id, user.user_name, user.user_nick, user.sex, user.address, user.post, user.user_phone) FROM UserEntity user WHERE user.user_id = :id")
    UserInformationDTO getInformationHandler(@Param("id") String id);
}
