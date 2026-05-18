package com.rabbiter.em.service;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rabbiter.em.common.Result;
import com.rabbiter.em.constants.Constants;
import com.rabbiter.em.constants.RedisConstants;
import com.rabbiter.em.entity.LoginForm;
import com.rabbiter.em.entity.User;
import com.rabbiter.em.entity.dto.EmailPasswordResetRequest;
import com.rabbiter.em.entity.dto.EmailRegisterRequest;
import com.rabbiter.em.entity.dto.UserDTO;
import com.rabbiter.em.exception.ServiceException;
import com.rabbiter.em.mapper.UserMapper;
import com.rabbiter.em.utils.TokenUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.concurrent.TimeUnit;


@Service
public class UserService extends ServiceImpl<UserMapper, User> {
    @Resource
    RedisTemplate<String,User> redisTemplate;
    @Resource
    EmailVerificationService emailVerificationService;

    public UserDTO login(LoginForm loginForm) {
        if (loginForm == null || !StringUtils.hasText(loginForm.getPassword())) {
            throw new ServiceException(Constants.CODE_403, "Account and password are required");
        }
        String account = StringUtils.hasText(loginForm.getAccount())
                ? loginForm.getAccount().trim()
                : (StringUtils.hasText(loginForm.getUsername()) ? loginForm.getUsername().trim() : "");
        if (!StringUtils.hasText(account)) {
            throw new ServiceException(Constants.CODE_403, "Account and password are required");
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.and(wrapper -> wrapper.eq("username", account)
                .or()
                .eq("email", account)
                .or()
                .apply("lower(email) = {0}", account.toLowerCase()));
        queryWrapper.eq("password",loginForm.getPassword());
        User user = getOne(queryWrapper);
        if(user == null) {
            throw new ServiceException(Constants.CODE_403,"Account or password is incorrect");
        }
        return createLoginSession(user);

    }

    private UserDTO createLoginSession(User user) {
        String token = TokenUtils.genToken(user.getId().toString(), user.getUsername());
        //把用户存到redis中
        redisTemplate.opsForValue().set(RedisConstants.USER_TOKEN_KEY + token,user);
        //jwt不设置过期时间，只设置redis过期时间。
        redisTemplate.expire(RedisConstants.USER_TOKEN_KEY +token, RedisConstants.USER_TOKEN_TTL, TimeUnit.MINUTES);
        //把查到的user的一些属性赋值给userDTO
        UserDTO userDTO = BeanUtil.copyProperties(user,UserDTO.class);
        //设置token
        userDTO.setToken(token);
        return userDTO;
    }

    public UserDTO register(LoginForm loginForm) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username",loginForm.getUsername());
        User user = getOne(queryWrapper);
        if(user!=null){
            throw new ServiceException(Constants.CODE_403,"Username is already in use");
        }else{
            user = new User();
            BeanUtils.copyProperties(loginForm,user);
            user.setNickname(loginForm.getUsername());
            user.setRole("user");
            save(user);
            return createLoginSession(user);
        }
    }

    public void sendEmailCode(String email, String purpose) {
        String normalizedEmail = emailVerificationService.normalizeEmail(email);
        String normalizedPurpose = emailVerificationService.normalizePurpose(purpose);
        User user = getByEmail(normalizedEmail);
        if ("register".equals(normalizedPurpose) && user != null) {
            throw new ServiceException(Constants.CODE_403, "Email is already in use");
        }
        if ("reset".equals(normalizedPurpose) && user == null) {
            throw new ServiceException(Constants.CODE_403, "No account is linked to this email");
        }
        emailVerificationService.sendCode(normalizedEmail, normalizedPurpose);
    }

    public UserDTO registerByEmail(EmailRegisterRequest request) {
        if (request == null
                || !StringUtils.hasText(request.getUsername())
                || !StringUtils.hasText(request.getPassword())
                || !StringUtils.hasText(request.getCode())) {
            throw new ServiceException(Constants.CODE_403, "Username, password, email and verification code are required");
        }
        if (getOne(request.getUsername()) != null) {
            throw new ServiceException(Constants.CODE_403, "Username is already in use");
        }
        String normalizedEmail = emailVerificationService.normalizeEmail(request.getEmail());
        if (getByEmail(normalizedEmail) != null) {
            throw new ServiceException(Constants.CODE_403, "Email is already in use");
        }
        emailVerificationService.verifyCode(normalizedEmail, "register", request.getCode());

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(request.getPassword());
        user.setEmail(normalizedEmail);
        user.setNickname(request.getUsername().trim());
        user.setRole("user");
        save(user);
        return createLoginSession(user);
    }

    public UserDTO resetPasswordByEmail(EmailPasswordResetRequest request) {
        if (request == null
                || !StringUtils.hasText(request.getNewPassword())
                || !StringUtils.hasText(request.getCode())) {
            throw new ServiceException(Constants.CODE_403, "Email, verification code and new password are required");
        }
        String normalizedEmail = emailVerificationService.normalizeEmail(request.getEmail());
        User user = getByEmail(normalizedEmail);
        if (user == null) {
            throw new ServiceException(Constants.CODE_403, "No account is linked to this email");
        }
        emailVerificationService.verifyCode(normalizedEmail, "reset", request.getCode());
        user.setPassword(request.getNewPassword());
        updateById(user);
        return createLoginSession(user);
    }

    public User getOne(String username){
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username",username);
        return getOne(queryWrapper);
    }

    public User getByEmail(String email) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return getOne(queryWrapper);
    }

    public Result saveUpdate(User user) {
        if(user.getId() != null) {
            // 修改
            User old = this.baseMapper.selectById(user.getId());
            old.setNickname(ObjectUtils.isEmpty(user.getNickname()) ? old.getNickname() : user.getNickname());
            old.setAvatarUrl(ObjectUtils.isEmpty(user.getAvatarUrl()) ? old.getAvatarUrl() : user.getAvatarUrl());
            old.setRole(ObjectUtils.isEmpty(user.getRole()) ? old.getRole() : user.getRole());
            old.setPhone(ObjectUtils.isEmpty(user.getPhone()) ? old.getPhone() : user.getPhone());
            if (!ObjectUtils.isEmpty(user.getEmail())) {
                String normalizedEmail = emailVerificationService.normalizeEmail(user.getEmail());
                User sameEmailUser = getByEmail(normalizedEmail);
                if (sameEmailUser != null && !sameEmailUser.getId().equals(old.getId())) {
                    return Result.error("400", "Email already exists");
                }
                old.setEmail(normalizedEmail);
            }
            old.setAddress(ObjectUtils.isEmpty(user.getAddress()) ? old.getAddress() : user.getAddress());
            super.updateById(old);
            return Result.success("Updated successfully");
        } else {
            // 新增
            if(!ObjectUtils.isEmpty(this.getOne(user.getUsername()))) {
                return Result.error("400", "Username already exists");
            }
            if (!ObjectUtils.isEmpty(user.getEmail())) {
                String normalizedEmail = emailVerificationService.normalizeEmail(user.getEmail());
                if (getByEmail(normalizedEmail) != null) {
                    return Result.error("400", "Email already exists");
                }
                user.setEmail(normalizedEmail);
            }
            user.setPassword(user.getNewPassword());
            super.save(user);
            return Result.success("Added successfully");
        }
    }

    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }

    /**
     * 重置密码
     *
     * @param id          用户id
     * @param newPassword 新密码
     */
    public void resetPassword(String id, String newPassword) {
        User user = this.getById(id);
        if(user == null) {
            return;
        }
        user.setPassword(newPassword);
        this.updateById(user);
    }
}
