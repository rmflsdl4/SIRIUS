package com.culiso.culiso.dto;

import com.culiso.culiso.entity.ContentsEntity;
import com.culiso.culiso.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostContentsControllerDTO {
    private ContentsEntity contents;
    private UserEntity user;
}
