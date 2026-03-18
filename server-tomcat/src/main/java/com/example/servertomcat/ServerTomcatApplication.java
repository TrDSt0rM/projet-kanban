package com.example.servertomcat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.servertomcat")
//@EnableMongoRepositories(basePackages = "com.example.servertomcat.comment")
public class ServerTomcatApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerTomcatApplication.class, args);
    }

}
