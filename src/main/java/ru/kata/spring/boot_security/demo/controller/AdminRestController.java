package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.validator.UserValidator;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/admin/rest")
public class AdminRestController {


    private final UserService userService;
    private final RoleService roleService;
     private final UserValidator userValidator;

    public AdminRestController(UserService userService, RoleService roleService, UserValidator userValidator) {
        this.userService = userService;
        this.roleService = roleService;
        this.userValidator = userValidator;
    }

    @GetMapping(value = "/")
    public List<User> showAllUsers() {
         return userService.getUsers();
    }
    @GetMapping(value = "/auth")
    public Authentication getUsersAuth(Authentication authentication) {
         return authentication;
    }

    @PostMapping(value = "/user")
    public List addUser1(@RequestBody @Validated User addUser, BindingResult bindingResult) {
        System.out.println(addUser);
        userValidator.validate(addUser, bindingResult);
        List errorsUser = new ArrayList<>();
        errorsUser.add(addUser);
        errorsUser.add(bindingResult.getAllErrors());
        if (!bindingResult.hasErrors()) {
            userService.saveUser(addUser);
        }
        return errorsUser;
    }

    @PutMapping(value = "/user")
    public User editUser(@RequestBody User editUser) {
        System.out.println(editUser.toString());
        userService.updateUser(editUser);
        return editUser;
    }
    @DeleteMapping(value = "/user/{id}")
    public void deleteUser(@PathVariable("id") Long idDelete) {
        userService.deleteUser(idDelete);
    }

    @GetMapping(value = "/user/{id}")
    public User getUser(@PathVariable("id") Long idGet) {
        return userService.findUser(idGet);
    }
}
