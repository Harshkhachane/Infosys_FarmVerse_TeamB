package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.SignupRequest;
import com.farmverse.dto.ApiResponse;
import com.farmverse.service.UserService;
import com.farmverse.service.AdminAuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Yeh frontend wale dost ke liye zaroori hai!
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminAuthService adminAuthService;

    @PostMapping("/admin/signup")
    public ResponseEntity<ApiResponse> adminSignup(@RequestBody SignupRequest signupRequest) {
        ApiResponse response = adminAuthService.registerAdmin(signupRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response); // 200 OK
        }
        return ResponseEntity.badRequest().body(response); // 400 Bad Request
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse> adminLogin(@RequestBody LoginRequest loginRequest) {
        ApiResponse response = adminAuthService.loginAdmin(loginRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody SignupRequest signupRequest) {
        ApiResponse response = userService.registerUser(signupRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response); // 200 OK
        }
        return ResponseEntity.badRequest().body(response); // 400 Bad Request
    }
  
    @GetMapping("/")
    public void get(){
       
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest) {
        ApiResponse response = userService.loginUser(loginRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        

        
        return ResponseEntity.badRequest().body(response);
    }
}
