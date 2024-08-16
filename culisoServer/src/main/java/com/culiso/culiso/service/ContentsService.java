package com.culiso.culiso.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.repository.ContentsRepository;

@Service
public class ContentsService {
    @Autowired
    private ContentsRepository contentsRepository;

    public int viewsCount(int contents_num, String user_id) {
        return contentsRepository.viewsCountHandle(contents_num);
    }

    public int contentsDelete(int contents_num) {
        return contentsRepository.contentsDeleteHandle(contents_num);
    }
}
