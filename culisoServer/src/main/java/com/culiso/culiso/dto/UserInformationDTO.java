package com.culiso.culiso.dto;

public class UserInformationDTO {
    private String user_id;
    private String user_name;
    private String user_nick;
    private String sex;
    private String address;
    private String post;
    private String user_phone;

    // 생성자, 게터, 세터
    public UserInformationDTO(String user_id, String user_name, String user_nick, String sex, String address, String post, String user_phone) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.user_nick = user_nick;
        this.sex = sex;
        this.address = address;
        this.post = post;
        this.user_phone = user_phone;
    }

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

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public String getUser_phone() {
        return user_phone;
    }

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }
}