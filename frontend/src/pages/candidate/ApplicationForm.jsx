import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationAPI } from '../../services/api'
import { 
  Upload, 
  FileText, 
  Send, 
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Calendar,
  MapPin,
  Award,
  Code,
  Globe,
  Plus,
  X,
  Save,
  ChevronRight
} from 'lucide-react'

const ApplicationForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioLink: '',
    skills: [],
    education: [],
    experience: [],
    certifications: [],
    availability: '',
    expectedSalary: '',
    noticePeriod: '',
    workMode: 'remote'
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingApplication, setExistingApplication] = useState(null)
  const [newSkill, setNewSkill] = useState('')
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddCertification, setShowAddCertification] = useState(false)
  const [showSkillsSection, setShowSkillsSection] = useState(false)

  useEffect(() => {
    checkExistingApplication()
  }, [])

  const checkExistingApplication = async () => {
    try {
      const response = await applicationAPI.getMyApplication()
      setExistingApplication(response.data)
    } catch (error) {
      // No existing application
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      if (fileType === 'resume') {
        setResumeFile(file)
      } else if (fileType === 'coverLetter') {
        setCoverLetterFile(file)
      }
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required')
      return
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }
    
    if (!resumeFile) {
      setError('Please upload your resume')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const submissionData = new FormData()
      
      const applicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        linkedinProfile: formData.linkedinProfile,
        githubProfile: formData.githubProfile,
        portfolioLink: formData.portfolioLink,
        skills: formData.skills.join(', '),
        education: formData.education.map(edu => 
          `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startYear} - ${edu.endYear})`
        ).join('\n\n'),
        experience: formData.experience.map(exp => 
          `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}`
        ).join('\n\n'),
        availability: formData.availability,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
        workMode: formData.workMode
      }
      
      submissionData.append('application', JSON.stringify(applicationData))
      
      if (resumeFile) {
        submissionData.append('resume', resumeFile)
      }
      if (coverLetterFile) {
        submissionData.append('coverLetter', coverLetterFile)
      }
      
      const response = await applicationAPI.submitApplication(submissionData)
      console.log('Application submitted successfully:', response)
      setSuccess(true)
      
      // Store submission in localStorage as backup
      localStorage.setItem('applicationSubmitted', 'true')
      localStorage.setItem('applicationData', JSON.stringify(applicationData))
      
      setTimeout(() => {
        navigate('/careers')
      }, 3000)
      
    } catch (error) {
      console.error('Application submission error:', error)
      
      // Handle different error types
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please ensure the backend is running and try again. If the issue persists, please contact support.')
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.')
        setTimeout(() => navigate('/login'), 2000)
      } else if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid application data. Please check your form and try again.')
      } else if (error.response?.status >= 500) {
        setError('Server error occurred. Please try again later or contact support if the issue persists.')
      } else {
        setError(error.response?.data?.message || 'Failed to submit application. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (existingApplication) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Application Already Submitted
            </h2>
            <p className="text-secondary-600 mb-8">
              You have already submitted your application. You can view and manage it from your dashboard.
            </p>
            <button
              onClick={() => navigate('/candidate/dashboard')}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <p className="text-secondary-600 mb-8">
              Thank you for your interest in Veridia. Your application has been received and will be reviewed by our team.
            </p>
            <p className="text-sm text-secondary-500 animate-pulse">
              Redirecting to careers page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Job Application</h1>
        <p className="text-secondary-600">Please fill out the form below to submit your application</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Bangalore, Karnataka"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Profiles */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Professional Profiles
            </h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="linkedinProfile" className="block text-sm font-medium text-secondary-700 mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="linkedinProfile"
                    name="linkedinProfile"
                    type="url"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="githubProfile" className="block text-sm font-medium text-secondary-700 mb-2">
                  GitHub Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Code className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="githubProfile"
                    name="githubProfile"
                    type="url"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="portfolioLink" className="block text-sm font-medium text-secondary-700 mb-2">
                Portfolio/Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="portfolioLink"
                  name="portfolioLink"
                  type="url"
                  value={formData.portfolioLink}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Skills & Expertise
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowSkillsSection(!showSkillsSection)}
                className="flex items-center justify-between w-full p-4 border-2 border-dashed border-secondary-300 rounded-lg hover:border-primary-400 transition-colors bg-secondary-50 hover:bg-primary-50"
              >
                <div className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-secondary-600" />
                  <span className="text-secondary-900 font-medium">
                    {showSkillsSection ? 'Hide Technologies' : 'Show All Technologies'}
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 text-secondary-600 transition-transform ${showSkillsSection ? 'rotate-90' : ''}`} />
              </button>

              {/* Selected Technologies Display */}
              {formData.skills.length > 0 && (
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h4 className="text-sm font-medium text-primary-900 mb-3">Selected Technologies ({formData.skills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 border border-primary-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies Grid - Hidden by default */}
              {showSkillsSection && (
                <div className="space-y-6 animate-fade-in">
                  {/* Programming Languages */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Programming Languages</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Perl', 'R'].map(lang => (
                        <label key={lang} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(lang)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, skills: [...formData.skills, lang]})
                              } else {
                                setFormData({...formData, skills: formData.skills.filter(s => s !== lang)})
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Frontend Technologies */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Frontend Technologies</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {['React', 'Angular', 'Vue.js', 'Next.js', 'HTML5', 'CSS3', 'SASS', 'Tailwind CSS', 'Bootstrap', 'jQuery', 'Redux', 'Webpack', 'Vite', 'Ember.js', 'Svelte'].map(tech => (
                        <label key={tech} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(tech)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, skills: [...formData.skills, tech]})
                              } else {
                                setFormData({...formData, skills: formData.skills.filter(s => s !== tech)})
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Backend Technologies */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Backend Technologies</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {['Node.js', 'Spring Boot', 'Django', 'Flask', 'Express.js', 'Ruby on Rails', 'Laravel', 'ASP.NET', 'FastAPI', 'NestJS', 'Hibernate', 'JPA', 'MyBatis', 'MVC', 'REST API'].map(tech => (
                        <label key={tech} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(tech)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, skills: [...formData.skills, tech]})
                              } else {
                                setFormData({...formData, skills: formData.skills.filter(s => s !== tech)})
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Databases */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Databases</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite', 'Cassandra', 'Elasticsearch', 'DynamoDB', 'Firebase', 'Neo4j', 'MariaDB', 'CouchDB', 'ArangoDB'].map(db => (
                        <label key={db} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(db)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, skills: [...formData.skills, db]})
                              } else {
                                setFormData({...formData, skills: formData.skills.filter(s => s !== db)})
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{db}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cloud & DevOps */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Cloud & DevOps</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Prometheus', 'Grafana', 'Nginx', 'Apache', 'Linux'].map(tech => (
                        <label key={tech} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(tech)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, skills: [...formData.skills, tech]})
                              } else {
                                setFormData({...formData, skills: formData.skills.filter(s => s !== tech)})
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Others */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Tools & Others</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {['Git', 'Jira', 'VS Code', 'IntelliJ IDEA', 'Eclipse', 'Postman', 'Swagger', 'Figma', 'Jest', 'Cypress', 'Selenium', 'JUnit', 'Maven', 'Gradle', 'npm'].map(tool => (
                        <label key={tool} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(tool)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({...formData, skills: [...formData.skills, tool]})
                              } else {
                                setFormData({...formData, skills: formData.skills.filter(s => s !== tool)})
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-secondary-700">{tool}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Custom Skills */}
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900 mb-3">Custom Skills</h4>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="input-field flex-1"
                        placeholder="Add custom skill (e.g., Machine Learning, AI, Blockchain)"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="btn-primary px-4 py-2"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t border-secondary-200">
                    <button
                      type="button"
                      onClick={() => setShowSkillsSection(false)}
                      className="btn-primary inline-flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Selection
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Job Preferences
            </h3>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="workMode" className="block text-sm font-medium text-secondary-700 mb-2">
                  Work Mode
                </label>
                <select
                  id="workMode"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-secondary-700 mb-2">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select availability</option>
                  <option value="immediate">Immediate</option>
                  <option value="2weeks">2 weeks</option>
                  <option value="1month">1 month</option>
                  <option value="2months">2 months</option>
                  <option value="3months">3+ months</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="noticePeriod" className="block text-sm font-medium text-secondary-700 mb-2">
                  Notice Period
                </label>
                <select
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select notice period</option>
                  <option value="none">None</option>
                  <option value="2weeks">2 weeks</option>
                  <option value="1month">1 month</option>
                  <option value="2months">2 months</option>
                  <option value="3months">3 months</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="expectedSalary" className="block text-sm font-medium text-secondary-700 mb-2">
                Expected Salary (Annual)
              </label>
              <input
                id="expectedSalary"
                name="expectedSalary"
                type="text"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="input-field"
                placeholder="$80,000 - $120,000"
              />
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Documents
            </h3>
          </div>
          <div className="card-body space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Resume *
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  {resumeFile ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="font-medium text-secondary-900">{resumeFile.name}</p>
                      <p className="text-sm text-secondary-600">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-secondary-400 mx-auto" />
                      <p className="font-medium text-secondary-900">Upload your resume</p>
                      <p className="text-sm text-secondary-600">PDF format, max 10MB</p>
                      <button
                        type="button"
                        className="btn-secondary"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Letter Upload */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Cover Letter (Optional)
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  id="coverLetter"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'coverLetter')}
                  className="hidden"
                />
                <label htmlFor="coverLetter" className="cursor-pointer">
                  {coverLetterFile ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="font-medium text-secondary-900">{coverLetterFile.name}</p>
                      <p className="text-sm text-secondary-600">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 text-secondary-400 mx-auto" />
                      <p className="font-medium text-secondary-900">Upload your cover letter</p>
                      <p className="text-sm text-secondary-600">PDF format, max 10MB</p>
                      <button
                        type="button"
                        className="btn-secondary"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/candidate/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm
