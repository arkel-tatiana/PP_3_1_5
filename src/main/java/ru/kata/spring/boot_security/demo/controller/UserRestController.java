package ru.kata.spring.boot_security.demo.controller;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/rest")
public class UserRestController {
    @GetMapping(value = "/auth")
    public Authentication getUsersAuth(Authentication authentication) {
        return authentication;
    }
}
