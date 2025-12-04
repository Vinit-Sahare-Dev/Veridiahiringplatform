-- Veridia Hiring Platform Database Setup
-- Run this script to create the database and initial data

CREATE DATABASE IF NOT EXISTS veridia_hiring;
USE veridia_hiring;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE', 'ADMIN') NOT NULL
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
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
    FOREIGN KEY (candidate_id) REFERENCES users(id)
);

-- Create uploads directory for resumes (this needs to be done manually)
-- mkdir uploads
-- mkdir uploads/resumes
