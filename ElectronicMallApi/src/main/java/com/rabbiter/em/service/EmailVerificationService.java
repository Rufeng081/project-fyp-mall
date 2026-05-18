package com.rabbiter.em.service;

import com.rabbiter.em.constants.Constants;
import com.rabbiter.em.constants.RedisConstants;
import com.rabbiter.em.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Service
public class EmailVerificationService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final RedisTemplate<String, Object> redisTemplate;
    private final JavaMailSender mailSender;

    @Value("${brevo.sender-email:}")
    private String senderEmail;

    public EmailVerificationService(RedisTemplate<String, Object> redisTemplate, JavaMailSender mailSender) {
        this.redisTemplate = redisTemplate;
        this.mailSender = mailSender;
    }

    public void sendCode(String email, String purpose) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedPurpose = normalizePurpose(purpose);
        String cooldownKey = buildCooldownKey(normalizedEmail, normalizedPurpose);
        Boolean inCooldown = redisTemplate.hasKey(cooldownKey);
        if (Boolean.TRUE.equals(inCooldown)) {
            throw new ServiceException(Constants.CODE_403, "Please wait 60 seconds before requesting another code");
        }
        if (!StringUtils.hasText(senderEmail)) {
            throw new ServiceException(Constants.CODE_500, "Email sender is not configured");
        }

        String code = generateCode();
        redisTemplate.opsForValue().set(
                buildCodeKey(normalizedEmail, normalizedPurpose),
                code,
                RedisConstants.EMAIL_CODE_TTL,
                TimeUnit.MINUTES
        );
        redisTemplate.opsForValue().set(
                cooldownKey,
                "1",
                RedisConstants.EMAIL_COOLDOWN_TTL,
                TimeUnit.SECONDS
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(normalizedEmail);
        message.setSubject("Online Mall verification code");
        message.setText("Your verification code is: " + code + "\n\nThis code expires in 5 minutes.");
        try {
            mailSender.send(message);
        } catch (RuntimeException e) {
            redisTemplate.delete(buildCodeKey(normalizedEmail, normalizedPurpose));
            redisTemplate.delete(cooldownKey);
            throw new ServiceException(Constants.CODE_500, "Failed to send verification email");
        }
    }

    public void verifyCode(String email, String purpose, String code) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedPurpose = normalizePurpose(purpose);
        Object storedCode = redisTemplate.opsForValue().get(buildCodeKey(normalizedEmail, normalizedPurpose));
        if (storedCode == null || !storedCode.toString().equals(code)) {
            throw new ServiceException(Constants.CODE_403, "Verification code is incorrect or expired");
        }
        redisTemplate.delete(buildCodeKey(normalizedEmail, normalizedPurpose));
    }

    public String normalizeEmail(String email) {
        if (!StringUtils.hasText(email)) {
            throw new ServiceException(Constants.CODE_403, "Email is required");
        }
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            throw new ServiceException(Constants.CODE_403, "Email format is invalid");
        }
        return normalizedEmail;
    }

    public String normalizePurpose(String purpose) {
        if (!StringUtils.hasText(purpose)) {
            return "register";
        }
        String normalizedPurpose = purpose.trim().toLowerCase(Locale.ROOT);
        if (!"register".equals(normalizedPurpose) && !"reset".equals(normalizedPurpose)) {
            throw new ServiceException(Constants.CODE_403, "Email code purpose is invalid");
        }
        return normalizedPurpose;
    }

    private String generateCode() {
        return String.format("%06d", RANDOM.nextInt(1000000));
    }

    private String buildCodeKey(String email, String purpose) {
        return RedisConstants.EMAIL_CODE_KEY + purpose + ":" + email;
    }

    private String buildCooldownKey(String email, String purpose) {
        return RedisConstants.EMAIL_COOLDOWN_KEY + purpose + ":" + email;
    }
}
