package com.culiso.culiso.dto;

public class MessageDTO {
    private String role;
    private String content;
    private String user_id;

    public MessageDTO() {}

    public MessageDTO(String content, String role, String user_id) {
        this.role = role;
        this.content = content;
        this.user_id = user_id;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
