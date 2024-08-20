package com.culiso.culiso.dto;

public class MessagesDTO {
    private String sender_type;
    private String user_chat_context;

    public MessagesDTO() {}

    public MessagesDTO(String sender_type, String user_chat_context) {
        this.sender_type = sender_type;
        this.user_chat_context = user_chat_context;
    }

    public String getSender_type() {
        return sender_type;
    }

    public void setSender_type(String sender_type) {
        this.sender_type = sender_type;
    }

    public String getUser_chat_context() {
        return user_chat_context;
    }

    public void setUser_chat_context(String user_chat_context) {
        this.user_chat_context = user_chat_context;
    }
}
