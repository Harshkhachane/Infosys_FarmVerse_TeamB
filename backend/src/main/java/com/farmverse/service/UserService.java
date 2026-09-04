package com.farmverse.service;

import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.SignupRequest;
import com.farmverse.model.User;
import com.farmverse.dto.ApiResponse;

public interface UserService {
    ApiResponse registerUser(SignupRequest signupRequest);
    ApiResponse loginUser(LoginRequest loginRequest);

    User getUserById(String id);
    User updateUserProfile(String id, User updatedData);
}