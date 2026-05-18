package com.rabbiter.em.constants;

public class RedisConstants {
    public static final String USER_TOKEN_KEY = "user:token:";
    public static final Integer USER_TOKEN_TTL = 180;
    public static final String EMAIL_CODE_KEY = "auth:email:code:";
    public static final String EMAIL_COOLDOWN_KEY = "auth:email:cooldown:";
    public static final Integer EMAIL_CODE_TTL = 5;
    public static final Integer EMAIL_COOLDOWN_TTL = 60;

    public static final String GOOD_TOKEN_KEY = "good:id:";
    public static final Integer GOOD_TOKEN_TTL = 30;
}
