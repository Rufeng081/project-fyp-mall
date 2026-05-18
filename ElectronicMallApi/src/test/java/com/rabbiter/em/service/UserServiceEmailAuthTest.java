package com.rabbiter.em.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.rabbiter.em.entity.LoginForm;
import com.rabbiter.em.entity.User;
import com.rabbiter.em.entity.dto.EmailPasswordResetRequest;
import com.rabbiter.em.entity.dto.EmailRegisterRequest;
import com.rabbiter.em.entity.dto.UserDTO;
import com.rabbiter.em.exception.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceEmailAuthTest {

    private UserService userService;
    private EmailVerificationService emailVerificationService;
    private RedisTemplate<String, User> redisTemplate;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        userService = spy(new UserService());
        emailVerificationService = mock(EmailVerificationService.class);
        redisTemplate = mock(RedisTemplate.class);
        ValueOperations<String, User> valueOperations = mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        ReflectionTestUtils.setField(userService, "emailVerificationService", emailVerificationService);
        ReflectionTestUtils.setField(userService, "redisTemplate", redisTemplate);
    }

    @Test
    void registerByEmailVerifiesCodeSavesUserAndReturnsLoggedInUser() {
        EmailRegisterRequest request = new EmailRegisterRequest();
        request.setUsername("student");
        request.setPassword("md5-password");
        request.setEmail("Student@Example.com");
        request.setCode("123456");
        doReturn("student@example.com").when(emailVerificationService).normalizeEmail("Student@Example.com");
        doReturn(null).when(userService).getOne("student");
        doReturn(null).when(userService).getByEmail("student@example.com");
        doAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(7);
            return true;
        }).when(userService).save(any(User.class));

        UserDTO loggedInUser = userService.registerByEmail(request);

        verify(emailVerificationService).verifyCode("student@example.com", "register", "123456");
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userService).save(userCaptor.capture());
        assertEquals("student", userCaptor.getValue().getUsername());
        assertEquals("student", userCaptor.getValue().getNickname());
        assertEquals("student@example.com", userCaptor.getValue().getEmail());
        assertEquals("user", userCaptor.getValue().getRole());
        assertEquals("student", loggedInUser.getUsername());
        assertEquals("student", loggedInUser.getNickname());
        assertNotNull(loggedInUser.getToken());
    }

    @Test
    void registerSetsNicknameToUsernameAndReturnsLoggedInUser() {
        LoginForm request = new LoginForm("newuser", "md5-password");
        doReturn(null).when(userService).getOne(any(QueryWrapper.class));
        doAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(11);
            return true;
        }).when(userService).save(any(User.class));

        UserDTO loggedInUser = userService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userService).save(userCaptor.capture());
        assertEquals("newuser", userCaptor.getValue().getNickname());
        assertEquals("newuser", loggedInUser.getNickname());
        assertNotNull(loggedInUser.getToken());
    }

    @Test
    void registerByEmailRejectsDuplicateEmailBeforeConsumingCode() {
        EmailRegisterRequest request = new EmailRegisterRequest();
        request.setUsername("student");
        request.setPassword("md5-password");
        request.setEmail("student@example.com");
        request.setCode("123456");
        doReturn("student@example.com").when(emailVerificationService).normalizeEmail("student@example.com");
        doReturn(null).when(userService).getOne("student");
        doReturn(new User()).when(userService).getByEmail("student@example.com");

        ServiceException exception = assertThrows(ServiceException.class, () -> userService.registerByEmail(request));

        assertEquals("Email is already in use", exception.getMessage());
    }

    @Test
    void resetPasswordByEmailVerifiesCodeUpdatesPasswordAndReturnsLoggedInUser() {
        EmailPasswordResetRequest request = new EmailPasswordResetRequest();
        request.setEmail("student@example.com");
        request.setCode("654321");
        request.setNewPassword("new-md5-password");
        User user = new User();
        user.setId(8);
        user.setUsername("student");
        user.setNickname("student");
        user.setEmail("student@example.com");
        doReturn("student@example.com").when(emailVerificationService).normalizeEmail("student@example.com");
        doReturn(user).when(userService).getByEmail("student@example.com");
        doReturn(true).when(userService).updateById(user);

        UserDTO loggedInUser = userService.resetPasswordByEmail(request);

        verify(emailVerificationService).verifyCode("student@example.com", "reset", "654321");
        assertEquals("new-md5-password", user.getPassword());
        verify(userService).updateById(user);
        assertEquals("student", loggedInUser.getUsername());
        assertNotNull(loggedInUser.getToken());
    }

    @Test
    void loginLooksUpMatchingUsernameOrEmailWithPassword() {
        User user = new User();
        user.setId(9);
        user.setUsername("student");
        user.setEmail("student@example.com");
        user.setNickname("student");
        doReturn(user).when(userService).getOne(any(QueryWrapper.class));

        UserDTO loggedInUser = userService.login(new com.rabbiter.em.entity.LoginForm("student@example.com", "md5-password"));

        ArgumentCaptor<QueryWrapper> queryCaptor = ArgumentCaptor.forClass(QueryWrapper.class);
        verify(userService).getOne(queryCaptor.capture());
        String sqlSegment = queryCaptor.getValue().getSqlSegment();
        assertEquals("student", loggedInUser.getUsername());
        assertNotNull(loggedInUser.getToken());
        org.junit.jupiter.api.Assertions.assertTrue(sqlSegment.contains("username"));
        org.junit.jupiter.api.Assertions.assertTrue(sqlSegment.contains("email"));
        org.junit.jupiter.api.Assertions.assertTrue(sqlSegment.contains("OR"));
        org.junit.jupiter.api.Assertions.assertTrue(sqlSegment.contains("password"));
    }

    @Test
    void loginAcceptsAccountFieldForEmailLogin() {
        User user = new User();
        user.setId(10);
        user.setUsername("student");
        user.setEmail("student@example.com");
        user.setNickname("student");
        doReturn(user).when(userService).getOne(any(QueryWrapper.class));
        LoginForm loginForm = new LoginForm();
        loginForm.setAccount("student@example.com");
        loginForm.setPassword("md5-password");

        UserDTO loggedInUser = userService.login(loginForm);

        assertEquals("student", loggedInUser.getUsername());
        assertNotNull(loggedInUser.getToken());
    }

    @Test
    void loginRejectsMissingAccountWithoutNullPointer() {
        LoginForm loginForm = new LoginForm();
        loginForm.setPassword("md5-password");

        ServiceException exception = assertThrows(ServiceException.class, () -> userService.login(loginForm));

        assertEquals("Account and password are required", exception.getMessage());
    }
}
