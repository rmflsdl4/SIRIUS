package com.culiso.culiso.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private int comment_num;
    private String comment_content;
    private LocalDateTime comment_date;
    private String user_id;
    private String user_name;
    private String user_nick;
    private String profile_url;
}
