package com.rabbiter.em.service;

import com.rabbiter.em.entity.User;
import com.rabbiter.em.entity.dto.EmailPasswordResetRequest;
import com.rabbiter.em.entity.dto.EmailRegisterRequest;
import com.rabbiter.em.exception.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

class UserServiceEmailAuthTest {

    private UserService userService;
    private EmailVerificationService emailVerificationService;

    @BeforeEach
    void setUp() {
        userService = spy(new UserService());
        emailVerificationService = mock(EmailVerificationService.class);
        ReflectionTestUtils.setField(userService, "emailVerificationService", emailVerificationService);
    }

    @Test
    void registerByEmailVerifiesCodeAndSavesUserWithNormalizedEmail() {
        EmailRegisterRequest request = new EmailRegisterRequest();
        request.setUsername("student");
        request.setPassword("md5-password");
        request.setEmail("Student@Example.com");
        request.setCode("123456");
        doReturn("student@example.com").when(emailVerificationService).normalizeEmail("Student@Example.com");
        doReturn(null).when(userService).getOne("student");
        doReturn(null).when(userService).getByEmail("student@example.com");
        doReturn(true).when(userService).save(any(User.class));

        userService.registerByEmail(request);

        verify(emailVerificationService).verifyCode("student@example.com", "register", "123456");
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userService).save(userCaptor.capture());
        assertEquals("student", userCaptor.getValue().getUsername());
        assertEquals("student@example.com", userCaptor.getValue().getEmail());
        assertEquals("user", userCaptor.getValue().getRole());
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
    void resetPasswordByEmailVerifiesCodeAndUpdatesPassword() {
        EmailPasswordResetRequest request = new EmailPasswordResetRequest();
        request.setEmail("student@example.com");
        request.setCode("654321");
        request.setNewPassword("new-md5-password");
        User user = new User();
        user.setEmail("student@example.com");
        doReturn("student@example.com").when(emailVerificationService).normalizeEmail("student@example.com");
        doReturn(user).when(userService).getByEmail("student@example.com");
        doReturn(true).when(userService).updateById(user);

        userService.resetPasswordByEmail(request);

        verify(emailVerificationService).verifyCode("student@example.com", "reset", "654321");
        assertEquals("new-md5-password", user.getPassword());
        verify(userService).updateById(user);
    }
}
