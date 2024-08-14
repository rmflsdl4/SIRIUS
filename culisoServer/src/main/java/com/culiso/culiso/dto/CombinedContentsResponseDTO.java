package com.culiso.culiso.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor     
public class CombinedContentsResponseDTO {
    private List<PostContentsDTO> contentsResult;
    private List<CommentDTO> commentResult;
    private List<FileDTO> fileResult;
    private int contentsRecommendResult;
    private String sessionUserID;
}
