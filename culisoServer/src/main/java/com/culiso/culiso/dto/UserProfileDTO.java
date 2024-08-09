package com.culiso.culiso.dto;

import java.time.LocalDateTime;

public class UserProfileDTO {
    private String user_id;        
    private String user_name;      
    private String user_nick;      
    private LocalDateTime create_date;  
    private String profile_url;    

    // 모든 필드를 포함하는 생성자
    public UserProfileDTO(String user_id, String user_name, String user_nick, LocalDateTime create_date, String profile_url) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.user_nick = user_nick;
        this.create_date = create_date;
        this.profile_url = profile_url;
    }

    // Getters and Setters
    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_nick() {
        return user_nick;
    }

    public void setUser_nick(String user_nick) {
        this.user_nick = user_nick;
    }

    public LocalDateTime getCreate_date() {
        return create_date;
    }

    public void setCreate_date(LocalDateTime create_date) {
        this.create_date = create_date;
    }

    public String getProfile_url() {
        return profile_url;
    }

    public void setProfile_url(String profile_url) {
        this.profile_url = profile_url;
    }
}
