import React from 'react'
import { User, Phone, MapPin, Globe, Link as LinkIcon, Code } from 'lucide-react'
import '../../styles/Applications.css'

const PersonalInfoForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
            required
          />
          {errors?.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
            required
          />
          {errors?.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors?.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your phone number"
          required
        />
        {errors?.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors?.location ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="City, Country"
          required
        />
        {errors?.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="w-4 h-4 inline mr-2" />
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Code className="w-4 h-4 inline mr-2" />
            GitHub Profile
          </label>
          <input
            type="url"
            name="githubProfile"
            value={formData.githubProfile}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Portfolio Website
          </label>
          <input
            type="url"
            name="portfolioLink"
            value={formData.portfolioLink}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm
