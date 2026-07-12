package com.transOp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.transOp.repository")
@EntityScan(basePackages = "com.transOp.entity")
public class TransOpApplication {
    public static void main(String[] args) {
        SpringApplication.run(TransOpApplication.class, args);
        System.out.println("🚛 TransitOps Application Started Successfully!");
        System.out.println("📍 Backend running at: http://localhost:8080/api");
    }
}