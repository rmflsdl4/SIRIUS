package com.culiso.culiso.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.dto.ContentListFileDTO;
import com.culiso.culiso.repository.ContentListRepository;
import com.culiso.culiso.repository.FileRepository;

@Service
public class ContentListService {
    @Autowired
    private ContentListRepository contentListRepository;

    @Autowired
    private FileRepository fileRepository;

    public List<ContentListFileDTO> contentListValue(int boardId) {
        List<ContentListFileDTO> contents;
        
        if (boardId == 1) {
            contents = contentListRepository.findMaxRecommendContent();
        } else {
            contents = contentListRepository.findAllContentsByBoardId(boardId);
        }

        // 각 contentsNum에 대해 파일 정보를 조회하고, ContentListFileDTO에 추가
        contents.forEach(content -> {
            fileRepository.findFirstByContentsNumOrderByFileUploadNumAsc(content.getContents_num())
                .ifPresent(file -> {
                    content.setFile_url(file.getFile_url());
                    content.setFile_name(file.getFile_name());
                });
        });

        return contents;
    }
}
