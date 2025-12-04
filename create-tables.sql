-- Veridia Hiring Platform - Table Creation
USE veridia_hiring;

-- Drop tables if they exist (for fresh start)
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE', 'ADMIN') NOT NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Applications table
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    skills TEXT,
    education TEXT,
    experience TEXT,
    resume_url VARCHAR(255),
    portfolio_link VARCHAR(255),
    status ENUM('SUBMITTED', 'REVIEWED', 'SHORTLISTED', 'SELECTED', 'REJECTED') NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@veridia.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'ADMIN');

-- Show created tables
SHOW TABLES;

-- Verify admin user
SELECT * FROM users WHERE email = 'admin@veridia.com';
