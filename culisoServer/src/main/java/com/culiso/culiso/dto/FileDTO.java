package com.culiso.culiso.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDTO {
    private int file_upload_num;
    private String file_url;
    private String file_name;
}
