package com.veridia.hiring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendApplicationSubmissionEmail(String toEmail, String candidateName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Submitted Successfully - Veridia Hiring Platform");
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Thank you for your interest in joining Veridia! We have successfully received your application.\n\n" +
            "Your application is currently under review. You will receive email notifications about any status updates.\n\n" +
            "You can check your application status by logging into your dashboard.\n\n" +
            "Best regards,\n" +
            "Veridia Hiring Team",
            candidateName
        );
        
        message.setText(emailBody);
        mailSender.send(message);
    }

    public void sendStatusUpdateEmail(String toEmail, String candidateName, String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Status Updated - Veridia Hiring Platform");
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Your application status has been updated to: %s\n\n" +
            "You can check more details by logging into your dashboard.\n\n" +
            "Best regards,\n" +
            "Veridia Hiring Team",
            candidateName, newStatus
        );
        
        message.setText(emailBody);
        mailSender.send(message);
    }
}
