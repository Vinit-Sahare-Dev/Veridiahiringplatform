import React from 'react'
import { Briefcase, Calendar, IndianRupee } from 'lucide-react'
import '../../styles/Applications.css'

const JobPreferencesForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Briefcase className="w-4 h-4 inline mr-2" />
          Work Mode *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['remote', 'hybrid', 'onsite'].map((mode) => (
            <label key={mode} className="relative">
              <input
                type="radio"
                name="workMode"
                value={mode}
                checked={formData.workMode === mode}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="cursor-pointer rounded-lg border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300">
                <div className="text-sm font-medium capitalize">{mode}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {mode === 'remote' && 'Work from anywhere'}
                  {mode === 'hybrid' && 'Mix of remote and office'}
                  {mode === 'onsite' && 'Work from office'}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors?.workMode && (
          <p className="mt-2 text-sm text-red-600">{errors.workMode}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability *
        </label>
        <select
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors?.availability ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select availability</option>
          <option value="immediate">Immediate</option>
          <option value="2-weeks">2 weeks notice</option>
          <option value="1-month">1 month notice</option>
          <option value="2-months">2 months notice</option>
          <option value="3-months">3 months notice</option>
        </select>
        {errors?.availability && (
          <p className="mt-2 text-sm text-red-600">{errors.availability}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <IndianRupee className="w-4 h-4 inline mr-2" />
            Expected Salary (Annual)
          </label>
          <input
            type="text"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.expectedSalary ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 60,00,000 INR"
          />
          {errors?.expectedSalary && (
            <p className="mt-2 text-sm text-red-600">{errors.expectedSalary}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Notice Period
          </label>
          <select
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select notice period</option>
            <option value="immediate">Immediate</option>
            <option value="2-weeks">2 weeks</option>
            <option value="1-month">1 month</option>
            <option value="2-months">2 months</option>
            <option value="3-months">3 months</option>
          </select>
          {errors?.noticePeriod && (
            <p className="mt-2 text-sm text-red-600">{errors.noticePeriod}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Salary Information</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Enter your expected annual salary in Indian Rupees</p>
          <p>• Include currency symbol (e.g., 60,00,000 INR, 50,00,000 INR)</p>
          <p>• This information helps us match you with suitable positions</p>
          <p>• Salary negotiations will be discussed during the interview process</p>
        </div>
      </div>
    </div>
  )
}

export default JobPreferencesForm
