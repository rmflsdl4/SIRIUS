package com.culiso.culiso.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.dto.MessagesDTO;
import com.culiso.culiso.repository.ChatRepository;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;

    public void chatRecord(String user_id, String role, String content){
        chatRepository.chatRecordHandler(user_id, content, role);
    }

    public List<MessagesDTO> getChatLog(String user_id){
        return chatRepository.getChatLogHandler(user_id);
    }
}
