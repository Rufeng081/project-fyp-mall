package com.rufeng.em.controller;

import com.rufeng.em.common.Result;
import com.rufeng.em.entity.User;
import com.rufeng.em.utils.TokenUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleController {
    @PostMapping("/role")
    public Result getUserRole(){
        User currentUser = TokenUtils.getCurrentUser();
        return Result.success(currentUser.getRole());
    }
}
