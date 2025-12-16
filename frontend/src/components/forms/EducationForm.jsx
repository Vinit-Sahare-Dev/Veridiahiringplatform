import React from 'react'
import { GraduationCap, Plus, X, Calendar, Award } from 'lucide-react'
import '../../styles/Applications.css'

const EducationForm = ({ education, onChange, errors }) => {
  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    }
    onChange([...education, newEducation])
  }

  const handleUpdateEducation = (index, field, value) => {
    const updatedEducation = [...education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    }
    onChange(updatedEducation)
  }

  const handleRemoveEducation = (index) => {
    onChange(education.filter((_, i) => i !== index))
  }

  const handleAddAchievement = (eduIndex) => {
    const updatedEducation = [...education]
    updatedEducation[eduIndex] = {
      ...updatedEducation[eduIndex],
      achievements: [...updatedEducation[eduIndex].achievements, '']
    }
    onChange(updatedEducation)
  }

  const handleUpdateAchievement = (eduIndex, achIndex, value) => {
    const updatedEducation = [...education]
    updatedEducation[eduIndex].achievements[achIndex] = value
    onChange(updatedEducation)
  }

  const handleRemoveAchievement = (eduIndex, achIndex) => {
    const updatedEducation = [...education]
    updatedEducation[eduIndex].achievements = updatedEducation[eduIndex].achievements.filter((_, i) => i !== achIndex)
    onChange(updatedEducation)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          <GraduationCap className="w-5 h-5 inline mr-2" />
          Education
        </h3>
        <button
          type="button"
          onClick={handleAddEducation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No education added yet. Click "Add Education" to get started.</p>
        </div>
      ) : (
        education.map((edu, index) => (
          <div key={edu.id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Stanford University"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Bachelor of Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study *
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleUpdateEducation(index, 'field', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA (optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => handleUpdateEducation(index, 'gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 3.8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date *
                </label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleUpdateEducation(index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-blue-50"
                  min="2000-01"
                  max="2030-12"
                  pattern="[0-9]{4}-[0-9]{2}"
                  placeholder="YYYY-MM"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => handleUpdateEducation(index, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-blue-50"
                  min="2000-01"
                  max="2030-12"
                  pattern="[0-9]{4}-[0-9]{2}"
                  placeholder="YYYY-MM"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Award className="w-4 h-4 inline mr-1" />
                  Achievements & Awards
                </label>
                <button
                  type="button"
                  onClick={() => handleAddAchievement(index)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Achievement
                </button>
              </div>
              
              {edu.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => handleUpdateAchievement(index, achIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Dean's List, Best Project Award"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(index, achIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      
      {errors?.education && (
        <p className="text-sm text-red-600">{errors.education}</p>
      )}
    </div>
  )
}

export default EducationForm
