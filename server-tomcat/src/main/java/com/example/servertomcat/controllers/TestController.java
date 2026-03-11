package com.example.servertomcat.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test-tomcat")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("source", "Serveur Tomcat (Java)");
        response.put("message", "Le message est bien arrivé jusqu'ici !");
        return response;
    }
}
