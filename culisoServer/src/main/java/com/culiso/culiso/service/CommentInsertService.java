package com.culiso.culiso.service;

import com.culiso.culiso.dto.CommentDTO;
import com.culiso.culiso.repository.CommentInsertRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentInsertService {

    @Autowired
    private CommentInsertRepository commentInsertRepository;

    public List<CommentDTO> commentInsert(String comment_content, String user_id, int contents_num) {

        commentInsertRepository.commentInsertHandle(comment_content, user_id, contents_num);

        return commentInsertRepository.commentSelectHandle(contents_num);
    }
}
