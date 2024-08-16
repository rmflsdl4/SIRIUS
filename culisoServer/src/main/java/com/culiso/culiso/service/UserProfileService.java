package com.culiso.culiso.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.dto.UserProfileDTO;
import com.culiso.culiso.repository.UserProfileRepository;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<UserProfileDTO> userProfileValue() {
        return userProfileRepository.userProfileHandler();
    }
}
