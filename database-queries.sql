-- Veridia Hiring Platform - All Database Queries
USE veridia_hiring;

-- 1. BASIC CRUD OPERATIONS

-- Insert new user (candidate)
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'john@example.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'CANDIDATE');

-- Insert new application
INSERT INTO applications (candidate_id, phone, skills, education, experience, portfolio_link, status)
VALUES (1, '+1234567890', 'Java, Spring Boot, React', 'BS Computer Science', '2 years at Tech Corp', 'https://portfolio.com', 'SUBMITTED');

-- Select all users
SELECT * FROM users;

-- Select all applications with user details
SELECT a.id, u.name, u.email, a.phone, a.skills, a.status, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
ORDER BY a.created_at DESC;

-- Update application status
UPDATE applications SET status = 'REVIEWED' WHERE id = 1;

-- Update user profile
UPDATE users SET name = 'John Smith', email = 'johnsmith@example.com' WHERE id = 1;

-- Delete application (will cascade delete due to foreign key)
DELETE FROM applications WHERE id = 1;

-- Delete user
DELETE FROM users WHERE id = 1;

-- 2. SEARCH AND FILTER QUERIES

-- Search applications by candidate name
SELECT a.id, u.name, u.email, a.phone, a.skills, a.status, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE u.name LIKE '%John%'
ORDER BY a.created_at DESC;

-- Search applications by skills
SELECT a.id, u.name, u.email, a.skills, a.status, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE a.skills LIKE '%Java%' OR a.skills LIKE '%React%'
ORDER BY a.created_at DESC;

-- Filter by status
SELECT a.id, u.name, u.email, a.phone, a.skills, a.status, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE a.status = 'SUBMITTED'
ORDER BY a.created_at DESC;

-- Combined search with filters
SELECT a.id, u.name, u.email, a.phone, a.skills, a.status, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE (u.name LIKE '%John%' OR a.skills LIKE '%Java%')
AND a.status IN ('SUBMITTED', 'REVIEWED')
ORDER BY a.created_at DESC;

-- 3. STATISTICS QUERIES

-- Application count by status
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 2) as percentage
FROM applications
GROUP BY status
ORDER BY count DESC;

-- Applications by date
SELECT 
    DATE(created_at) as date,
    COUNT(*) as applications_count
FROM applications
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top skills
SELECT 
    TRIM(SKILL) as skill,
    COUNT(*) as frequency
FROM (
    SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(skills, ',', n.n), ',', -1) AS SKILL
    FROM applications
    JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) n
    ON CHAR_LENGTH(skills) - CHAR_LENGTH(REPLACE(skills, ',', '')) >= n.n - 1
    WHERE skills IS NOT NULL AND skills != ''
) skill_list
GROUP BY TRIM(SKILL)
ORDER BY frequency DESC
LIMIT 10;

-- 4. ADMIN QUERIES

-- Get all candidates
SELECT id, name, email, created_at
FROM users
WHERE role = 'CANDIDATE'
ORDER BY created_at DESC;

-- Get recent applications (last 7 days)
SELECT a.id, u.name, u.email, a.phone, a.skills, a.status, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY a.created_at DESC;

-- Applications needing review
SELECT a.id, u.name, u.email, a.phone, a.skills, a.created_at
FROM applications a
JOIN users u ON a.candidate_id = u.id
WHERE a.status = 'SUBMITTED'
ORDER BY a.created_at ASC;

-- 5. MAINTENANCE QUERIES

-- Clean up old applications (older than 1 year)
-- DELETE FROM applications WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Update timestamps
UPDATE applications SET updated_at = NOW() WHERE id = 1;

-- Check database size
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'veridia_hiring'
ORDER BY size_mb DESC;

-- 6. SECURITY QUERIES

-- Check for duplicate emails
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Get users without applications
SELECT u.id, u.name, u.email, u.created_at
FROM users u
LEFT JOIN applications a ON u.id = a.candidate_id
WHERE a.id IS NULL AND u.role = 'CANDIDATE';

-- 7. SAMPLE DATA FOR TESTING

-- Insert sample candidates
INSERT INTO users (name, email, password, role) VALUES
('Alice Johnson', 'alice@example.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'CANDIDATE'),
('Bob Smith', 'bob@example.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'CANDIDATE'),
('Carol Davis', 'carol@example.com', '$2a$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'CANDIDATE');

-- Insert sample applications
INSERT INTO applications (candidate_id, phone, skills, education, experience, portfolio_link, status) VALUES
(2, '+1234567890', 'Java, Spring Boot, MySQL, React', 'BS Computer Science, MIT', '3 years at Google', 'https://alice.dev', 'REVIEWED'),
(3, '+0987654321', 'Python, Django, PostgreSQL, Vue.js', 'MS Software Engineering', '2 years at Microsoft', 'https://bob.codes', 'SHORTLISTED'),
(4, '+1122334455', 'JavaScript, Node.js, MongoDB, Angular', 'BS Information Technology', '1 year at Startup', 'https://carol.tech', 'SUBMITTED');

-- 8. REPORTING QUERIES

-- Monthly application trends
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as applications,
    SUM(CASE WHEN status = 'SELECTED' THEN 1 ELSE 0 END) as selected,
    SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
FROM applications
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC
LIMIT 12;

-- Application funnel
SELECT 
    'Total Applications' as stage,
    COUNT(*) as count
FROM applications
UNION ALL
SELECT 
    'Reviewed' as stage,
    COUNT(*) as count
FROM applications
WHERE status IN ('REVIEWED', 'SHORTLISTED', 'SELECTED', 'REJECTED')
UNION ALL
SELECT 
    'Shortlisted' as stage,
    COUNT(*) as count
FROM applications
WHERE status IN ('SHORTLISTED', 'SELECTED')
UNION ALL
SELECT 
    'Selected' as stage,
    COUNT(*) as count
FROM applications
WHERE status = 'SELECTED';

USE veridia_hiring;
ALTER TABLE applications MODIFY COLUMN status VARCHAR(20) NOT NULL;