package com.azentrix.security;

import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtUtil {

    private static final String SECRET =
            "azentrixsecretkeyazentrixsecretkey12345";

    private static final Key KEY =
            new SecretKeySpec(
                    SECRET.getBytes(),
                    SignatureAlgorithm.HS256.getJcaName());

    public static String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000))
                .signWith(KEY)
                .compact();
    }
    public static String generateRefreshToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 604800000))
                .signWith(KEY)
                .compact();
    }
    public static String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}