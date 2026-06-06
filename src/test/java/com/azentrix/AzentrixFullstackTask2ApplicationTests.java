package com.azentrix;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import com.azentrix.security.JwtUtil;
import com.azentrix.service.RateLimiterService;

class AzentrixFullstackTask2ApplicationTests {

    @Test
    void testJwtTokenGeneration() {
        String token = JwtUtil.generateToken("test@azentrix.com");
        assertNotNull(token);
    }

    @Test
    void testJwtRefreshTokenGeneration() {
        String refreshToken = JwtUtil.generateRefreshToken("test@azentrix.com");
        assertNotNull(refreshToken);
    }

    @Test
    void testJwtEmailExtraction() {
        String token = JwtUtil.generateToken("user@azentrix.com");
        String email = JwtUtil.extractEmail(token);
        assertTrue(email.equals("user@azentrix.com"));
    }

    @Test
    void testRateLimiterAllowsFirstRequest() {
        RateLimiterService limiter = new RateLimiterService();
        boolean allowed = limiter.allowRequest("user1@azentrix.com");
        assertTrue(allowed);
    }

    @Test
    void testRateLimiterExhaustion() {
        RateLimiterService limiter = new RateLimiterService();
        String user = "user2@azentrix.com";
        
        for (int i = 0; i < 30; i++) {
            limiter.allowRequest(user);
        }
        
        boolean allowed31st = limiter.allowRequest(user);
        assertFalse(allowed31st);
    }
}