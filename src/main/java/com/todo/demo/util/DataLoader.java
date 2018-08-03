package com.todo.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.todo.demo.model.Role;
import com.todo.demo.model.RoleName;
import com.todo.demo.repository.RoleRepository;

@Component
public class DataLoader implements ApplicationRunner {


    @Autowired
    RoleRepository roleRepository;

    public void run(ApplicationArguments args) {
    	roleRepository.save(new Role(RoleName.ROLE_USER));
    }
}
