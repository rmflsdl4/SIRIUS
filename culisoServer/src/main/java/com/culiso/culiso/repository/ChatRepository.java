package com.culiso.culiso.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.culiso.culiso.dto.MessagesDTO;
import com.culiso.culiso.entity.ChatEntity;

import jakarta.transaction.Transactional;

@Repository
public interface ChatRepository extends JpaRepository<ChatEntity, Integer>{
    @Modifying
    @Transactional
    @Query("INSERT INTO ChatEntity chat (user_id, user_chat_context, sender_type) VALUES (:id, :content, :type)")
    int chatRecordHandler(
        @Param("id") String id, 
        @Param("content") String content,
        @Param("type") String type
    );

    @Query("SELECT new com.culiso.culiso.dto.MessagesDTO(chat.sender_type, chat.user_chat_context) FROM ChatEntity chat WHERE chat.user_id = :user_id")
    List<MessagesDTO> getChatLogHandler(@Param("user_id") String user_id);    
}
