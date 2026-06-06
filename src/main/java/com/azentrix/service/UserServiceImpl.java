package com.azentrix.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.azentrix.dto.RegisterRequest;
import com.azentrix.entity.User;
import com.azentrix.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void register(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userRepository.save(user);
    }
    @Override
    public String login(String email, String password) {

        User user =
                userRepository.findByEmail(email)
                        .orElse(null);

        if (user == null) {
            return null;
        }

        if (!user.getPassword().equals(password)) {
            return null;
        }

        return com.azentrix.security.JwtUtil
                .generateToken(email);
    }
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}