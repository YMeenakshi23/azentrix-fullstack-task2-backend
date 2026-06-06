package com.azentrix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.azentrix.dto.AuthResponse;
import com.azentrix.dto.LoginRequest;
import com.azentrix.dto.RefreshRequest;
import com.azentrix.dto.RegisterRequest;
import com.azentrix.security.JwtUtil;
import com.azentrix.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request) {

        userService.register(request);

        return new AuthResponse("User registered successfully");
    }
    @PostMapping("/login")
    public Object login(
            @RequestBody LoginRequest request) {

        String token =
                userService.login(
                        request.getEmail(),
                        request.getPassword());

        if (token == null) {
            return "Invalid Credentials";
        }

        String refreshToken =
                com.azentrix.security.JwtUtil
                        .generateRefreshToken(
                                request.getEmail());

        return new com.azentrix.dto.LoginResponse(
                token,
                refreshToken);
    }
    @PostMapping("/refresh")
    public Object refreshToken(
            @RequestBody RefreshRequest request) {

        String email =
                JwtUtil.extractEmail(
                        request.getRefreshToken());

        String newAccessToken =
                JwtUtil.generateToken(email);

        return java.util.Map.of(
                "accessToken",
                newAccessToken);
    }
}