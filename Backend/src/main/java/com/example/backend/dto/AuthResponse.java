package com.example.backend.dto;

public class AuthResponse {

    private String token;
    private String refreshToken;
    private String tipo = "Bearer";
    private String rol;
    private String userId;

    public AuthResponse(String token, String refreshToken, String rol, String userId) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.rol = rol;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getTipo() { return tipo; }
    public String getRol() { return rol; }
    public String getUserId() { return userId; }
}
