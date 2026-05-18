package com.rabbiter.em.entity;

public class LoginForm {
    private String account;
    private String username;
    private String password;

    public LoginForm() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LoginForm(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginForm{" +
                "account='" + account + '\'' +
                ", " +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
