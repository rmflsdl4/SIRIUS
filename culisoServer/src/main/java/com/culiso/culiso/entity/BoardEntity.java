package com.culiso.culiso.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "board")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    @Getter @Setter
    private int board_id;

    @Column(nullable = false)
    @Getter @Setter
    private String board_name;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Getter @Setter
    private String board_intro;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Getter @Setter
    private LocalDateTime board_date;

    @Column(nullable = false)
    @Getter @Setter
    private char board_read;

    @Column(nullable = false)
    @Getter @Setter
    private char board_write;

    @Column(nullable = false)
    @Getter @Setter
    private char board_com_write;

    @Column(nullable = false)
    @Getter @Setter
    private String admin_id;
}