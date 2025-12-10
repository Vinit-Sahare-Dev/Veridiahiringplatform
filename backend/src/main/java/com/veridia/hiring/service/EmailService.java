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

    public void sendApplicationSubmissionEmail(String toEmail, String candidateName, String jobTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Submitted Successfully - Veridia Hiring Platform");
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Thank you for applying to the %s position at Veridia! We have successfully received your application.\n\n" +
            "Your application is currently under review. You will receive email notifications about any status updates.\n\n" +
            "You can check your application status by logging into your dashboard.\n\n" +
            "Best regards,\n" +
            "Veridia Hiring Team",
            candidateName, jobTitle
        );
        
        message.setText(emailBody);
        mailSender.send(message);
    }

    // Overload for backward compatibility
    public void sendApplicationSubmissionEmail(String toEmail, String candidateName) {
        sendApplicationSubmissionEmail(toEmail, candidateName, "your desired position");
    }

    public void sendStatusUpdateEmail(String toEmail, String candidateName, String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Status Updated - Veridia Hiring Platform");
        
        String emailBody;
        String statusMessage;
        
        switch (newStatus) {
            case "SHORTLISTED":
                statusMessage = "Congratulations! You have been shortlisted for the next round of interviews.";
                emailBody = String.format(
                    "Dear %s,\n\n" +
                    "%s\n\n" +
                    "Our team was impressed with your application and qualifications. We would like to invite you for an interview to discuss your experience and how you can contribute to our team.\n\n" +
                    "Next Steps:\n" +
                    "1. Our HR team will contact you within 2-3 business days to schedule the interview\n" +
                    "2. Please keep your availability information updated in your profile\n" +
                    "3. Prepare for technical and behavioral rounds\n\n" +
                    "Interview Details:\n" +
                    "- Duration: 45-60 minutes\n" +
                    "- Format: Video call/In-person (based on your location and preference)\n" +
                    "- Rounds: Technical + HR\n\n" +
                    "You can check your application status and updates by logging into your dashboard.\n\n" +
                    "If you have any questions, feel free to reply to this email.\n\n" +
                    "Best regards,\n" +
                    "Veridia Hiring Team",
                    candidateName, statusMessage
                );
                break;
            case "ACCEPTED":
                statusMessage = "Congratulations! You have been selected for the position.";
                emailBody = String.format(
                    "Dear %s,\n\n" +
                    "%s\n\n" +
                    "We are thrilled to offer you the position at Veridia! Your skills and experience perfectly match what we were looking for.\n\n" +
                    "Offer Details:\n" +
                    "- Position: [Position Name]\n" +
                    "- Start Date: To be discussed\n" +
                    "- Location: As discussed\n\n" +
                    "Our HR team will contact you shortly with the detailed offer letter and next steps for onboarding.\n\n" +
                    "Welcome to the Veridia family!\n\n" +
                    "Best regards,\n" +
                    "Veridia Hiring Team",
                    candidateName, statusMessage
                );
                break;
            case "REJECTED":
                statusMessage = "We regret to inform you that your application was not selected at this time.";
                emailBody = String.format(
                    "Dear %s,\n\n" +
                    "%s\n\n" +
                    "Thank you for your interest in Veridia and for taking the time to apply. While we were impressed with your qualifications, we have decided to move forward with other candidates whose experience more closely matches our current requirements.\n\n" +
                    "We encourage you to keep an eye on our future openings that may be a better fit for your skills and experience.\n\n" +
                    "We wish you the very best in your job search and future career endeavors.\n\n" +
                    "Best regards,\n" +
                    "Veridia Hiring Team",
                    candidateName, statusMessage
                );
                break;
            default:
                statusMessage = "Your application status has been updated to: " + newStatus;
                emailBody = String.format(
                    "Dear %s,\n\n" +
                    "%s\n\n" +
                    "You can check more details by logging into your dashboard.\n\n" +
                    "Best regards,\n" +
                    "Veridia Hiring Team",
                    candidateName, statusMessage
                );
        }
        
        message.setText(emailBody);
        mailSender.send(message);
    }
}
