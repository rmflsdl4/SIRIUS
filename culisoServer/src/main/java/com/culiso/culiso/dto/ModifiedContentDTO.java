package com.culiso.culiso.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor   
public class ModifiedContentDTO {
    private int contents_num;
    private String contents_title;
    private String content;
}
