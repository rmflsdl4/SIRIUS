package com.culiso.culiso.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostContentsRequestDTO {
    private int contents_num;
    private String user_id;
}
