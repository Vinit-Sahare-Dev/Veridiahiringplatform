package com.veridia.hiring.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationRequest {
    @NotBlank(message = "Phone is required")
    private String phone;

    private String skills;
    private String education;
    private String experience;
    private String portfolioLink;

    public ApplicationRequest() {}

    public ApplicationRequest(String phone, String skills, String education, String experience, String portfolioLink) {
        this.phone = phone;
        this.skills = skills;
        this.education = education;
        this.experience = experience;
        this.portfolioLink = portfolioLink;
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getPortfolioLink() { return portfolioLink; }
    public void setPortfolioLink(String portfolioLink) { this.portfolioLink = portfolioLink; }
}
