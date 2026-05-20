package com.rufeng.em.service;

import com.rufeng.em.exception.ServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class EmailVerificationServiceTest {

    private RedisTemplate<String, Object> redisTemplate;
    private ValueOperations<String, Object> valueOperations;
    private JavaMailSender mailSender;
    private EmailVerificationService service;

    @BeforeEach
    void setUp() {
        redisTemplate = mock(RedisTemplate.class);
        valueOperations = mock(ValueOperations.class);
        mailSender = mock(JavaMailSender.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        service = new EmailVerificationService(redisTemplate, mailSender);
        ReflectionTestUtils.setField(service, "senderEmail", "noreply@example.com");
    }

    @Test
    void sendCodeStoresSixDigitCodeForFiveMinutesAndStartsCooldown() {
        when(redisTemplate.hasKey("auth:email:cooldown:register:student@example.com")).thenReturn(false);

        service.sendCode(" Student@Example.com ", "register");

        ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);
        verify(valueOperations).set(
                eq("auth:email:code:register:student@example.com"),
                codeCaptor.capture(),
                eq(5L),
                eq(TimeUnit.MINUTES)
        );
        assertTrue(codeCaptor.getValue().matches("\\d{6}"));
        verify(valueOperations).set(
                "auth:email:cooldown:register:student@example.com",
                "1",
                60L,
                TimeUnit.SECONDS
        );
        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendCodeUsesFypUkmDemoEmailTemplate() {
        when(redisTemplate.hasKey("auth:email:cooldown:register:student@example.com")).thenReturn(false);

        service.sendCode("student@example.com", "register");

        ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);
        verify(valueOperations).set(
                eq("auth:email:code:register:student@example.com"),
                codeCaptor.capture(),
                eq(5L),
                eq(TimeUnit.MINUTES)
        );

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());
        SimpleMailMessage message = messageCaptor.getValue();

        assertEquals("[FYP-UKM] Rufeng Mall Demo Verification Code", message.getSubject());
        assertEquals("Dear User,\n\n"
                + "Your verification code for the FYP-UKM Rufeng Mall Demo System is:\n\n"
                + "====================\n"
                + "      " + codeCaptor.getValue() + "\n"
                + "====================\n\n"
                + "This code is valid for 5 minutes. Please do not share this code with anyone.\n\n"
                + "This email was sent automatically by the FYP Mall demo system for account registration or password reset verification.\n\n"
                + "If you did not request this code, you can safely ignore this email.\n\n"
                + "Regards,\n"
                + "FYP-UKM Rufeng Mall Demo System\n"
                + "LI RUFENG\n"
                + "A206331", message.getText());
    }

    @Test
    void sendCodeRejectsRepeatedSendDuringCooldown() {
        when(redisTemplate.hasKey("auth:email:cooldown:register:student@example.com")).thenReturn(true);

        ServiceException exception = assertThrows(
                ServiceException.class,
                () -> service.sendCode("student@example.com", "register")
        );

        assertEquals("Please wait 60 seconds before requesting another code", exception.getMessage());
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendCodeClearsRedisKeysWhenMailDeliveryFails() {
        when(redisTemplate.hasKey("auth:email:cooldown:register:student@example.com")).thenReturn(false);
        doThrow(new MailSendException("SMTP failed")).when(mailSender).send(any(SimpleMailMessage.class));

        ServiceException exception = assertThrows(
                ServiceException.class,
                () -> service.sendCode("student@example.com", "register")
        );

        assertEquals("Failed to send verification email", exception.getMessage());
        verify(redisTemplate).delete("auth:email:code:register:student@example.com");
        verify(redisTemplate).delete("auth:email:cooldown:register:student@example.com");
    }

    @Test
    void verifyCodeDeletesCodeAfterSuccessfulMatch() {
        when(valueOperations.get("auth:email:code:reset:student@example.com")).thenReturn("123456");

        service.verifyCode("student@example.com", "reset", "123456");

        verify(redisTemplate).delete("auth:email:code:reset:student@example.com");
    }

    @Test
    void verifyCodeRejectsWrongCode() {
        when(valueOperations.get("auth:email:code:register:student@example.com")).thenReturn("123456");

        ServiceException exception = assertThrows(
                ServiceException.class,
                () -> service.verifyCode("student@example.com", "register", "000000")
        );

        assertEquals("Verification code is incorrect or expired", exception.getMessage());
    }
}
