package com.veridia.hiring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class HiringPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(HiringPlatformApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("\n============================================");
        System.out.println("✅ Backend Running Successfully!");
        System.out.println("📌 Application: Veridia Hiring Platform");
        System.out.println("🌐 Server Port: 8080");
        System.out.println("🕒 Status: Ready to accept requests");
        System.out.println("============================================\n");
    }
}
