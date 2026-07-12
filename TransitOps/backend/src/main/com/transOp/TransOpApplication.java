package com.transOp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.config", "com.controller", "com.service", "com.repository", "com.entity", "com.util", "com.dto", "com.transOp"})
@EntityScan(basePackages = {"com.entity"})
@EnableJpaRepositories(basePackages = {"com.repository"})
public class TransOpApplication {
    public static void main(String[] args) {
        SpringApplication.run(TransOpApplication.class, args);
        System.out.println("🚛 TransitOps Application Started Successfully!");
        System.out.println("📍 Backend running at: http://localhost:8080/api");
    }
}