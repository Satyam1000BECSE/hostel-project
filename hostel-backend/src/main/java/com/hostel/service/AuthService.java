package com.hostel.service;

import com.hostel.config.JwtService;
import com.hostel.dto.LoginRequest;
import com.hostel.dto.RegisterRequest;
import com.hostel.exception.CustomException;
import com.hostel.model.Role;
import com.hostel.model.User;
import com.hostel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @SuppressWarnings("unused")
    private final EmailService emailService;

    // 🔹 Register
  public String registerAndGenerateToken(RegisterRequest request) {

    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new RuntimeException("Email already exists");
    }

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(Role.USER);

    userRepository.save(user);

    return jwtService.generateToken(user);
}


    // 🔹 Login
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid Credentials");
        }

        return jwtService.generateToken(user);

    }
}
