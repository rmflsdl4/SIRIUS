package com.culiso.culiso.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModifiedContentsResponseDTO {
    private ModifiedContentDTO contentsResult;
    private List<FileDTO> fileResult;
}
