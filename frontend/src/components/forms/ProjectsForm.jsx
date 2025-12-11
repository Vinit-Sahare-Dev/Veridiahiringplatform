import React from 'react'
import { Plus, Trash2, Github, ExternalLink, Briefcase } from 'lucide-react'

const ProjectsForm = ({ projects = [], onChange, errors = {} }) => {
  const addProject = () => {
    const newProjects = [
      ...projects,
      {
        name: '',
        description: '',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        startDate: '',
        endDate: '',
        current: false
      }
    ]
    onChange(newProjects)
  }

  const removeProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index)
    onChange(newProjects)
  }

  const updateProject = (index, field, value) => {
    const newProjects = [...projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    onChange(newProjects)
  }

  const addTechnology = (index, tech) => {
    if (tech.trim()) {
      const newProjects = [...projects]
      const currentTechs = newProjects[index].technologies || []
      if (!currentTechs.includes(tech.trim())) {
        newProjects[index].technologies = [...currentTechs, tech.trim()]
        onChange(newProjects)
      }
    }
  }

  const removeTechnology = (index, techToRemove) => {
    const newProjects = [...projects]
    newProjects[index].technologies = newProjects[index].technologies.filter(tech => tech !== techToRemove)
    onChange(newProjects)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No projects added yet</p>
          <p className="text-sm text-gray-400">Click "Add Project" to showcase your work</p>
        </div>
      )}

      {projects.map((project, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="text-md font-medium text-gray-900">Project {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeProject(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name || ''}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub URL
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={project.githubUrl || ''}
                  onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description *
            </label>
            <textarea
              value={project.description || ''}
              onChange={(e) => updateProject(index, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what this project does, your role, and key achievements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Live Demo URL
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={project.liveUrl || ''}
                onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://your-project-demo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used *
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a technology (e.g., React, Node.js, MongoDB)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTechnology(index, e.target.value)
                      e.target.value = ''
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.previousElementSibling
                    addTechnology(index, input.value)
                    input.value = ''
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(project.technologies || []).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index, tech)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                value={project.startDate || ''}
                onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={project.endDate || ''}
                onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                disabled={project.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`current-${index}`}
                checked={project.current || false}
                onChange={(e) => {
                  updateProject(index, 'current', e.target.checked)
                  if (e.target.checked) {
                    updateProject(index, 'endDate', '')
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                Currently working on this
              </label>
            </div>
          </div>
        </div>
      ))}

      {errors.projects && (
        <p className="text-red-500 text-sm">{errors.projects}</p>
      )}
    </div>
  )
}

export default ProjectsForm
