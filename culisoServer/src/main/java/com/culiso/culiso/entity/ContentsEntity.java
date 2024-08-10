package com.culiso.culiso.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
public class ContentsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    @Getter @Setter
    private int contents_num;

    @Column(nullable = false)
    @Getter @Setter
    private String contents_title;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Getter @Setter
    private String content;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Getter @Setter
    private LocalDateTime contents_date;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    @Getter @Setter
    private int recommend;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    @Getter @Setter
    private int views;

    @Column(nullable = false)
    @Getter @Setter
    private String user_id;

    @Column(nullable = false)
    @Getter @Setter
    private int board_id;
}
