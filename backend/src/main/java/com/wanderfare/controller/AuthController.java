package com.wanderfare.controller;

import com.wanderfare.dto.auth.AuthResponse;
import com.wanderfare.dto.auth.LoginRequest;
import com.wanderfare.dto.auth.RegisterRequest;
import com.wanderfare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = userService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register new user (Customer, Vendor, or Admin)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = userService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user (client-side token removal)")
    public ResponseEntity<String> logout() {
        // JWT is stateless, so logout is handled on client side
        return ResponseEntity.ok("Logged out successfully");
    }
}
