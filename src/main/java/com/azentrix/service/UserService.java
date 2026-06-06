package com.azentrix.service;

import com.azentrix.dto.RegisterRequest;
import com.azentrix.entity.User;

public interface UserService {

    void register(RegisterRequest request);
    String login(String email, String password);
    User findByEmail(String email);
    User getUserByEmail(String email);

}