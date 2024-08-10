package com.culiso.culiso.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.culiso.culiso.dto.UserProfileDTO;
import com.culiso.culiso.entity.UserEntity;

import static com.culiso.culiso.dto.UserProfileDTO.*;

public interface UserProfileRepository extends JpaRepository<UserEntity, String> {
    @Query("SELECT new com.culiso.culiso.dto.UserProfileDTO(user.user_id, user.user_name, user.user_nick, user.create_date, user.profile_url) FROM UserEntity user WHERE user.delete_flag = false and user.user_id = 'user1'")
    // Optional<Long> loginHandler(@Param("id") String id);
    List<UserProfileDTO> userProfileHandler();
}
