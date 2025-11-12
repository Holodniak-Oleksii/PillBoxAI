package com.pill.box.api.user;

import com.pill.box.api.user.dto.AuthResponse;
import com.pill.box.api.user.dto.LoginRequest;
import com.pill.box.api.user.dto.RegisterRequest;
import com.pill.box.api.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("auth")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = userService.register(request);
        AuthResponse response = AuthResponse.builder()
                .message("User registered successfully")
                .user(user)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = userService.login(request);
        UserResponse user = userService.getUserByUsername(request.getUsername());
        AuthResponse response = AuthResponse.builder()
                .message("Login successful")
                .token(token)
                .user(user)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
}
