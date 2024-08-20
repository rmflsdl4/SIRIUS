package com.culiso.culiso.entity;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat")
public class ChatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    @Getter @Setter
    private int chat_id;

    @Column(nullable = false)
    @Getter @Setter
    private String user_id;

    @Column(nullable = false)
    @Getter @Setter
    private String user_chat_context;

    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Getter @Setter
    private LocalDateTime send_time;

    @Column(nullable = false, columnDefinition = "CHAR")
    @Getter @Setter
    private String sender_type;
}

