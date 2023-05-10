package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.util.ErrorUser;
import ru.kata.spring.boot_security.demo.validator.UserValidator;

import java.util.List;


@RestController
@RequestMapping("/admin/rest")
public class AdminRestController {


    private final UserService userService;
    private final RoleService roleService;
    private final UserValidator userValidator;
    private final ErrorUser errorUser;


    public AdminRestController(UserService userService, RoleService roleService, UserValidator userValidator, ErrorUser errorUser) {
        this.userService = userService;
        this.roleService = roleService;
        this.userValidator = userValidator;
        this.errorUser = errorUser;
    }

    @GetMapping(value = "/")
    public ResponseEntity<List<User>> showAllUsers() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok().body(users);
    }

    @GetMapping(value = "/auth")
    public ResponseEntity<Authentication> getUsersAuth(Authentication authentication) {
         return ResponseEntity.ok().body(authentication);
    }

    @PostMapping(value = "/user")
    public ResponseEntity<ErrorUser> addUser(@RequestBody @Validated User addUser, BindingResult bindingResult) {
        userValidator.validate(addUser, bindingResult);
        errorUser.setUser(addUser);
        errorUser.setBd(bindingResult.getAllErrors());
        if (!bindingResult.hasErrors()) {
           userService.saveUser(addUser);
        }
        return ResponseEntity.ok().body(errorUser);
    }

    @PutMapping(value = "/user")
    public ResponseEntity<User> editUser(@RequestBody User editUser) {
        System.out.println(editUser.toString());
        userService.updateUser(editUser);
        return ResponseEntity.ok().body(editUser);
    }
    @DeleteMapping(value = "/user/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long idDelete) {
        userService.deleteUser(idDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @GetMapping(value = "/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long idGet) {
        User findUser = userService.findUser(idGet);
        return ResponseEntity.ok().body(findUser);
    }
}
