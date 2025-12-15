
# Veridia Hiring Platform

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen?style=for-the-badge&logo=springboot)
![Spring Security](https://img.shields.io/badge/Spring%20Security-Enabled-6DB33F?style=for-the-badge&logo=springsecurity)
![JWT](https://img.shields.io/badge/JWT-Security-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwindcss)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Orchestration-2496ED?style=for-the-badge&logo=docker)
![Render](https://img.shields.io/badge/Render-Deployment-46E3B7?style=for-the-badge&logo=render)
![Build](https://img.shields.io/badge/Build-Maven-red?style=for-the-badge&logo=apachemaven)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

A **full-stack enterprise hiring management system** designed to streamline recruitment for **Veridia**. Built with modern technologies and real-world architecture patterns.

---


## 🌟 Featured Capabilities

### 🎯 Core Functionality
- **End-to-End Hiring Lifecycle** — job posting → applications → status tracking
- **Role-Based Access Control** — Admin & Candidate workflows
- **Real-time API Integration** — React ↔ Spring Boot
- **Secure Authentication** — JWT + Spring Security
- **Email Automation** — application updates via SMTP
- **Responsive UI** — optimized for desktop & mobile

### 💼 Business Features
- **Admin Dashboard** — manage jobs & candidates centrally
- **Application Status Management** — review, shortlist, reject
- **Resume Upload Support** — scalable file handling
- **Scalable Architecture** — layered backend with JPA/Hibernate

---

## ✨ Features

- 🧑‍💼 Job creation, update & deletion (Admin)
- 📝 Multi-step candidate application flow
- 📊 Admin dashboard for application tracking
- 🔐 JWT-based authentication & authorization
- 📧 Email notifications via SMTP
- 📱 Fully responsive UI (mobile & desktop)

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.5
- Spring Security
- Spring Data JPA (Hibernate)
- JWT Authentication
- MySQL 8.0
- Spring Boot Mail

### Frontend
- React 18.3.1
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React Icons

### DevOps
- Docker
- Docker Compose
- Render

---

## 🧠 System Architecture Flow

```mermaid
flowchart LR
    User[Candidate / Admin]
    UI[React + Tailwind UI]
    API[Spring Boot REST API]
    Auth[JWT Security Layer]
    DB[(MySQL Database)]
    Mail[Email Service]

    User --> UI
    UI --> API
    API --> Auth
    Auth --> API
    API --> DB
    API --> Mail
````

---

## 🔄 Application Workflow

```mermaid
sequenceDiagram
    participant C as Candidate
    participant F as Frontend
    participant B as Backend
    participant D as Database

    C->>F: Submit Job Application
    F->>B: POST /api/applications
    B->>D: Save Application
    D-->>B: Success
    B-->>F: Application Submitted
```


## 📈 Future Enhancements

* Analytics dashboard
* Interview scheduling
* Resume parsing
* Cloud storage integration

---

## 👨‍💻 Author

**Vinit Sahare**
* GitHub: [https://github.com/Vinit-Sahare-Dev](https://github.com/Vinit-Sahare-Dev)
* LinkedIn: [https://linkedin.com/in/vinit-sahare](https://linkedin.com/in/vinit-sahare)

---

⭐ *If you like this project, give it a star!*

## 📸 Screenshots

### 🏠 Home Page
<img width="100%" alt="Home Page" src="screenshorts/Home.png" />

### 🔐 Login & Register
<img width="100%" alt="Login Register" src="screenshorts/LoginRegister.png" />

### 💼 Careers Page
<img width="100%" alt="Careers Page" src="screenshorts/CareersPage.png" />

### 📋 Open Positions
<img width="100%" alt="Open Positions" src="screenshorts/CareersPageOpenPositions.png" />

### 📝 Job Application
<img width="100%" alt="Job Application" src="screenshorts/JobApplication.png" />

---

### 👤 Candidate Dashboard
<img width="100%" alt="Candidate Dashboard" src="screenshorts/CandicateDashboard.png" />

### 👤 Candidate Profile
<img width="100%" alt="Candidate Profile" src="screenshorts/CandidateProfile.png" />

### 🔔 Candidate Notifications
<img width="100%" alt="Candidate Notifications" src="screenshorts/CandidateNotification.png" />

---

### 🔑 Admin Login
<img width="100%" alt="Admin Login" src="screenshorts/AdminLogin.png" />

### 📊 Admin Dashboard
<img width="100%" alt="Admin Dashboard" src="screenshorts/AdminDashboard.png" />

### 📄 Admin Job Handling
<img width="100%" alt="Admin Job Handle" src="screenshorts/AdminJobHandle.png" />

### 📑 Admin Job Applications
<img width="100%" alt="Admin Job Applications" src="screenshorts/AdminJobApplication.png" />

### ✅ Application Status Management
<img width="100%" alt="Application Status" src="screenshorts/AdminapplicationStatus.png" />

---

### 📧 Email Service
<img width="100%" alt="Email Service" src="screenshorts/Emailservice.png" />





