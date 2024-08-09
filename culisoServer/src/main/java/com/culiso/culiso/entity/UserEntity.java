package com.culiso.culiso.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    @Column(nullable = false)
    @Getter @Setter
    private String user_id;

    @Column(nullable = false)
    @Getter @Setter
    private String user_pw;

    @Column(nullable = false)
    @Getter @Setter
    private String user_name;

    @Column(nullable = false)
    @Getter @Setter
    private String user_phone;

    @Column(nullable = false)
    @Getter @Setter
    private String post;

    @Column(nullable = false)
    @Getter @Setter
    private String address;

    @Column(nullable = false)
    @Getter @Setter
    private String sex;

    @Column(nullable = false)
    @Getter @Setter
    private String user_nick;

    @Column(nullable = false)
    @Getter @Setter
    private String adminID;

    // 추가된 필드들
    @Column(nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    @Getter @Setter
    private LocalDateTime create_date;

    @Column(nullable = true, length = 100)
    @Getter @Setter
    private String profile_url;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    @Getter @Setter
    private boolean delete_flag;
}
