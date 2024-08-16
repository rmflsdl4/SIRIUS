package com.culiso.culiso.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.repository.ContentsRepository;
import com.culiso.culiso.repository.ContentsRecommendRepository;

@Service
public class RecommendClickedService {
    @Autowired
    private ContentsRepository contentsRepository;
    @Autowired
    private ContentsRecommendRepository contentsRecommendRepository;

    public int recommendClicked(int check, int contents_num, String user_id) {
        if(check > 0) {
            contentsRepository.plusRecommendHandle(contents_num);
            contentsRecommendRepository.insertContentsRecommendHandle(user_id, contents_num);
        }
        else {
            contentsRepository.minusRecommendHandle(contents_num);
            contentsRecommendRepository.deleteContentsRecommendHandle(user_id, contents_num);
        }

        return contentsRepository.contentsRecommendSelectHandle(contents_num);
    }
}
