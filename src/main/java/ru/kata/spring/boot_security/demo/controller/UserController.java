package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;

@RequestMapping("/user")
@Controller
public class UserController {
    @GetMapping()
    public String showUsers() {
        return "user";
    }
}

