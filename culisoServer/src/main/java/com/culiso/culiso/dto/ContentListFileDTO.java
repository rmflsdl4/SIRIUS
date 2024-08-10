package com.culiso.culiso.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentListFileDTO {
    private int contents_num;
    private String contents_title;
    private String content;
    private int recommend;
    private int views;
    private LocalDateTime contents_date;
    private String board_name;
    private String file_url;
    private String file_name;

    public ContentListFileDTO(int contents_num, String board_name, String contents_title, String content, int recommend, int views, LocalDateTime contents_date) {
        this.contents_num = contents_num;
        this.board_name = board_name;
        this.contents_title = contents_title;
        this.content = content;
        this.recommend = recommend;
        this.views = views;
        this.contents_date = contents_date;
        this.file_url = null; // 필요시 초기화
        this.file_name = null; // 필요시 초기화
    }
    
}
