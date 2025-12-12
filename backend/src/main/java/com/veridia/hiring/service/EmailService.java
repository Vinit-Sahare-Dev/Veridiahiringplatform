package com.veridia.hiring.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    
    @Value("${spring.mail.username}")
    private String fromEmail;

    // Welcome email for new user registration
    public void sendWelcomeEmail(String toEmail, String firstName, String lastName) {
        try {
            logger.info("Sending welcome email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🎉 Welcome to Veridia Hiring Platform - Your Career Journey Starts Here!");
            
            String emailBody = String.format(
                "Dear %s %s,\n\n" +
                "🎊 Welcome to Veridia Hiring Platform! We're absolutely thrilled to have you join our community of talented professionals.\n\n" +
                "✅ Your account has been successfully created with the email: %s\n\n" +
                "🚀 What you can do next:\n" +
                "• 📋 Browse 500+ available job positions across industries\n" +
                "• 📝 Submit applications for roles that match your skills\n" +
                "• 📊 Track your application status in real-time\n" +
                "• 👤 Update your profile with your latest information\n\n" +
                "🎯 Getting Started:\n" +
                "1. 🔐 Log in to your account using your email and password\n" +
                "2. 📄 Complete your profile with your skills and experience\n" +
                "3. 🔍 Start exploring job opportunities\n\n" +
                "💡 Pro Tip: Complete profiles are 3x more likely to be viewed by employers!\n\n" +
                "Our dedicated team is committed to helping you find the perfect opportunity that matches your career goals.\n\n" +
                "📧 Need help? Reach out to our support team at empsyncofficial@gmail.com\n\n" +
                "We wish you the best in your job search journey!\n\n" +
                "Best regards,\n" +
                "The Veridia Hiring Team\n\n" +
                "---\n" +
                "🌐 Veridia Hiring Platform\n" +
                "Connecting talent with opportunity",
                firstName, lastName, toEmail
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send welcome email: " + e.getMessage(), e);
        }
    }

    // Application submission confirmation email
    public void sendApplicationSubmissionEmail(String toEmail, String firstName, String lastName, String jobTitle) {
        try {
            logger.info("Sending application submission email to: {} for job: {}", toEmail, jobTitle);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Application Submitted Successfully - Veridia Hiring Platform");
            
            String emailBody = String.format(
                "Dear %s %s,\n\n" +
                "Congratulations! Your application for the %s position at Veridia has been successfully submitted.\n\n" +
                "Application Details:\n" +
                "• Position Applied: %s\n" +
                "• Submission Date: %s\n" +
                "• Application ID: APP-%s\n\n" +
                "What happens next:\n" +
                "1. Your application will be reviewed by our hiring team\n" +
                "2. You'll receive email notifications about status updates\n" +
                "3. If shortlisted, we'll contact you for the next round\n" +
                "4. You can track your application status in your dashboard\n\n" +
                "Current Status: Under Review\n\n" +
                "Tips for the next steps:\n" +
                "• Keep your profile information updated\n" +
                "• Check your email regularly for updates\n" +
                "• Prepare for potential interviews\n" +
                "• Be ready to discuss your experience and skills\n\n" +
                "You can check your application status anytime by logging into your dashboard.\n\n" +
                "Thank you for your interest in joining Veridia! We're excited to learn more about you.\n\n" +
                "Best regards,\n" +
                "The Veridia Hiring Team\n\n" +
                "---\n" +
                "Veridia Hiring Platform\n" +
                "Connecting talent with opportunity",
                firstName, lastName, jobTitle, jobTitle, 
                new java.text.SimpleDateFormat("MMM dd, yyyy").format(new java.util.Date()),
                System.currentTimeMillis() % 100000
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Application submission email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send application submission email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send application email: " + e.getMessage(), e);
        }
    }

    // Status update email with personalized content
    public void sendStatusUpdateEmail(String toEmail, String firstName, String lastName, String newStatus, String jobTitle) {
        try {
            logger.info("Sending status update email to: {} with status: {}", toEmail, newStatus);
            
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
                        "Dear %s %s,\n\n" +
                        "%s\n\n" +
                        "Great news! Your application for the %s position has been shortlisted. Our team was impressed with your qualifications and experience.\n\n" +
                        "What this means:\n" +
                        "• You've successfully passed the initial screening\n" +
                        "• Our hiring team believes you're a strong fit for the role\n" +
                        "• We'd like to learn more about you in an interview\n\n" +
                        "Next Steps:\n" +
                        "1. Our HR team will contact you within 2-3 business days\n" +
                        "2. We'll schedule an interview at a convenient time\n" +
                        "3. Please prepare for technical and behavioral rounds\n\n" +
                        "Interview Details:\n" +
                        "• Duration: 45-60 minutes\n" +
                        "• Format: Video call/In-person\n" +
                        "• Rounds: Technical assessment + HR discussion\n\n" +
                        "Preparation Tips:\n" +
                        "• Review the job description and requirements\n" +
                        "• Prepare examples of your relevant experience\n" +
                        "• Research about Veridia and our culture\n" +
                        "• Have questions ready about the role and team\n\n" +
                        "You can check your application status and updates in your dashboard.\n\n" +
                        "If you have any questions, feel free to reply to this email.\n\n" +
                        "Congratulations on reaching this milestone!\n\n" +
                        "Best regards,\n" +
                        "The Veridia Hiring Team",
                        firstName, lastName, statusMessage, jobTitle
                    );
                    break;
                case "ACCEPTED":
                    statusMessage = "Congratulations! You have been selected for the position.";
                    emailBody = String.format(
                        "Dear %s %s,\n\n" +
                        "%s\n\n" +
                        "We are absolutely thrilled to offer you the %s position at Veridia! Your skills, experience, and interview performance have shown us that you're the perfect fit for our team.\n\n" +
                        "Offer Details:\n" +
                        "• Position: %s\n" +
                        "• Status: Official Offer Extended\n" +
                        "• Next Steps: Onboarding Process\n\n" +
                        "What happens next:\n" +
                        "1. Our HR team will send you the detailed offer letter\n" +
                        "2. We'll discuss start date and onboarding schedule\n" +
                        "3. You'll receive information about benefits and compensation\n" +
                        "4. We'll prepare your welcome kit and workspace\n\n" +
                        "Welcome to Veridia!\n\n" +
                        "We're excited to have you join our team and can't wait to see the amazing contributions you'll make. Your journey with us is just beginning, and we're committed to supporting your growth and success.\n\n" +
                        "Please keep an eye out for the formal offer letter and additional onboarding information.\n\n" +
                        "If you have any questions about the offer or next steps, please don't hesitate to reach out.\n\n" +
                        "Welcome aboard!\n\n" +
                        "Best regards,\n" +
                        "The Veridia Hiring Team\n\n" +
                        "P.S. We're excited to welcome you to the Veridia family!",
                        firstName, lastName, statusMessage, jobTitle, jobTitle
                    );
                    break;
                case "REJECTED":
                    statusMessage = "We regret to inform you that your application was not selected at this time.";
                    emailBody = String.format(
                        "Dear %s %s,\n\n" +
                        "%s\n\n" +
                        "Thank you so much for your interest in the %s position at Veridia and for taking the time to go through our application and interview process.\n\n" +
                        "While we were genuinely impressed with your qualifications and experience, we have decided to move forward with other candidates whose skills and experience more closely match our current requirements for this specific role.\n\n" +
                        "What this doesn't mean:\n" +
                        "• This is not a reflection of your abilities or potential\n" +
                        "• We encourage you to apply for future positions\n" +
                        "• We'll keep your profile on file for suitable opportunities\n\n" +
                        "Stay Connected:\n" +
                        "• Follow us on LinkedIn for company updates and new openings\n" +
                        "• Keep an eye on our careers page for future opportunities\n" +
                        "• We encourage you to apply again for roles that match your skills\n\n" +
                        "We sincerely appreciate the time and effort you invested in this process. It was a pleasure getting to know you and learning about your experience.\n\n" +
                        "We wish you the very best in your job search and future career endeavors. We're confident that you'll find an opportunity where you can truly shine and make a significant impact.\n\n" +
                        "Thank you again for your interest in Veridia.\n\n" +
                        "Best regards,\n" +
                        "The Veridia Hiring Team",
                        firstName, lastName, statusMessage, jobTitle
                    );
                    break;
                default:
                    statusMessage = "Your application status has been updated to: " + newStatus;
                    emailBody = String.format(
                        "Dear %s %s,\n\n" +
                        "%s\n\n" +
                        "Your application for the %s position has been updated.\n\n" +
                        "You can check more details and track your progress by logging into your dashboard.\n\n" +
                        "If you have any questions about this update, please feel free to reach out to our team.\n\n" +
                        "Best regards,\n" +
                        "The Veridia Hiring Team",
                        firstName, lastName, statusMessage, jobTitle
                    );
            }
            
            message.setText(emailBody);
            mailSender.send(message);
            
            logger.info("Status update email sent successfully to: {} with status: {}", toEmail, newStatus);
        } catch (Exception e) {
            logger.error("Failed to send status update email to: {} with status: {}", toEmail, newStatus, e);
            throw new RuntimeException("Failed to send status update email: " + e.getMessage(), e);
        }
    }

    // Overload for backward compatibility
    public void sendApplicationSubmissionEmail(String toEmail, String candidateName, String jobTitle) {
        // Split candidateName into firstName and lastName
        String[] names = candidateName.split(" ", 2);
        String firstName = names.length > 0 ? names[0] : "Candidate";
        String lastName = names.length > 1 ? names[1] : "";
        
        sendApplicationSubmissionEmail(toEmail, firstName, lastName, jobTitle);
    }
}
