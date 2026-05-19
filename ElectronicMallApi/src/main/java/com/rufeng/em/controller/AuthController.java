package com.rufeng.em.controller;

import com.rufeng.em.common.Result;
import com.rufeng.em.entity.dto.EmailCodeRequest;
import com.rufeng.em.entity.dto.EmailPasswordResetRequest;
import com.rufeng.em.entity.dto.EmailRegisterRequest;
import com.rufeng.em.entity.dto.UserDTO;
import com.rufeng.em.service.UserService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@CrossOrigin
@RestController
public class AuthController {
    @Resource
    private UserService userService;

    @PostMapping("/api/auth/send-email-code")
    public Result sendEmailCode(@RequestBody EmailCodeRequest request) {
        userService.sendEmailCode(request.getEmail(), request.getPurpose());
        return Result.success("Verification code sent");
    }

    @PostMapping("/api/auth/register-by-email")
    public Result registerByEmail(@RequestBody EmailRegisterRequest request) {
        UserDTO dto = userService.registerByEmail(request);
        return Result.success(dto);
    }

    @PostMapping("/api/auth/reset-password-by-email")
    public Result resetPasswordByEmail(@RequestBody EmailPasswordResetRequest request) {
        UserDTO dto = userService.resetPasswordByEmail(request);
        return Result.success(dto);
    }
}
