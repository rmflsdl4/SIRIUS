package com.culiso.culiso.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    @Getter @Setter
    private int comment_num;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Getter @Setter
    private String comment_content;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Getter @Setter
    private LocalDateTime comment_date;

    @Column(nullable = false)
    @Getter @Setter
    private String user_id;

    @Column(nullable = false)
    @Getter @Setter
    private int contents_num;
}

