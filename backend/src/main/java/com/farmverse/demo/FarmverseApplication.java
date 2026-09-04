package com.farmverse.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.farmverse")
@EnableMongoRepositories(basePackages = "com.farmverse.repository") // 👈 Scans com.farmverse.repository
public class FarmverseApplication {

    public static void main(String[] args) {
        SpringApplication.run(FarmverseApplication.class, args);
    }
}