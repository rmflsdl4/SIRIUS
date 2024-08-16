package com.culiso.culiso.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.dto.CommentDTO;
import com.culiso.culiso.dto.FileDTO;
import com.culiso.culiso.dto.PostContentsDTO;
import com.culiso.culiso.dto.CombinedContentsResponseDTO;
import com.culiso.culiso.repository.PostContentsRepository;

@Service
public class PostContentsService {

    @Autowired
    private PostContentsRepository postContentsRepository;

    public CombinedContentsResponseDTO postContents(int contents_num, String sessionUserID) {
        List<PostContentsDTO> contentsResult = postContentsRepository.getPostContents(contents_num);
        List<CommentDTO> commentResult = postContentsRepository.getComments(contents_num);
        List<FileDTO> fileResult = postContentsRepository.getFiles(contents_num);
        int contentsRecommendResult = postContentsRepository.countUserRecommend(contents_num);

        return new CombinedContentsResponseDTO(contentsResult, commentResult, fileResult, contentsRecommendResult, sessionUserID);
    }
}
