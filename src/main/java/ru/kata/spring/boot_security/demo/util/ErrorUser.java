package ru.kata.spring.boot_security.demo.util;
import org.springframework.stereotype.Component;
import org.springframework.validation.ObjectError;
import ru.kata.spring.boot_security.demo.model.User;
import java.util.List;
@Component
public class ErrorUser {
    public User user;
    public List<ObjectError> bd;

    public ErrorUser(User user, List<ObjectError> bd) {
        this.user = user;
        this.bd = bd;
    }

    public ErrorUser() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ObjectError> getBd() {
        return bd;
    }

    public void setBd(List<ObjectError> bd) {
        this.bd = bd;
    }
}
