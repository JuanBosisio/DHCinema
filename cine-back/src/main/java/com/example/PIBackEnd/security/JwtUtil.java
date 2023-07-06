package com.example.PIBackEnd.security;

import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtUtil {
    public String encodeToken(String token) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(token.getBytes());
    }

    public String decodeToken(String encodedToken) {
        byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedToken);
        return new String(decodedBytes);
    }
}
