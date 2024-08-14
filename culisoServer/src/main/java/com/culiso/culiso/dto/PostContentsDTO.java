package com.culiso.culiso.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostContentsDTO {
    private String user_id;
    private String user_name;
    private String user_nick;
    private LocalDateTime create_date;
    private String profile_url;
    private int contents_num;
    private String contents_title;
    private String content;
    private int recommend;
    private LocalDateTime contents_date;
    private int views;
    private int board_id;
    private String board_name;
}
