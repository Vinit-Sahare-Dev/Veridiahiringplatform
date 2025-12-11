import React from 'react'
import { Plus, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react'

const ExperienceForm = ({ experience = [], onChange, errors = {} }) => {
  const addExperience = () => {
    const newExperience = [
      ...experience,
      {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ]
    onChange(newExperience)
  }

  const removeExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index)
    onChange(newExperience)
  }

  const updateExperience = (index, field, value) => {
    const newExperience = [...experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    onChange(newExperience)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No experience added yet</p>
          <p className="text-sm text-gray-400">Click "Add Experience" to add your work history</p>
        </div>
      )}

      {experience.map((exp, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-md font-medium text-gray-900">Experience {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeExperience(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tech Company Inc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA or Remote"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                value={exp.startDate || ''}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={exp.endDate || ''}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                disabled={exp.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`current-exp-${index}`}
                checked={exp.current || false}
                onChange={(e) => {
                  updateExperience(index, 'current', e.target.checked)
                  if (e.target.checked) {
                    updateExperience(index, 'endDate', '')
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`current-exp-${index}`} className="ml-2 text-sm text-gray-700">
                Currently working here
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => updateExperience(index, 'description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your responsibilities, achievements, and key projects..."
            />
          </div>
        </div>
      ))}

      {errors.experience && (
        <p className="text-red-500 text-sm">{errors.experience}</p>
      )}
    </div>
  )
}

export default ExperienceForm
