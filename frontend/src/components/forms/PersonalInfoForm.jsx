import React, { useState, useEffect } from 'react'
import { User, Phone, MapPin, Globe, Link as LinkIcon, Code, Navigation } from 'lucide-react'
import '../../styles/Applications.css'

const PersonalInfoForm = ({ formData, onChange, errors }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setIsLoadingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          
          if (data && data.display_name) {
            // Extract city and country from the address
            const address = data.address
            const city = address.city || address.town || address.village || ''
            const state = address.state || ''
            const country = address.country || ''
            
            let locationString = ''
            if (city && country) {
              locationString = `${city}, ${country}`
            } else if (country) {
              locationString = country
            } else {
              locationString = data.display_name.split(',')[0] // Fallback to first part of address
            }
            
            onChange('location', locationString)
          } else {
            // Fallback: use coordinates if geocoding fails
            onChange('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          }
        } catch (error) {
          console.error('Error getting address:', error)
          // Fallback to coordinates
          onChange('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location access.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An unknown error occurred while getting location.')
        }
      }
    )
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
        <div className="flex gap-2">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="City, Country"
            required
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className={`px-4 py-3 rounded-lg border transition-colors ${
              isLoadingLocation 
                ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            title="Get current location"
          >
            {isLoadingLocation ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Navigation className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors?.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
        {locationError && (
          <p className="mt-1 text-sm text-orange-600">{locationError}</p>
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
