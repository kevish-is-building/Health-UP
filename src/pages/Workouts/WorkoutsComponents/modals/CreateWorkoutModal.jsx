import { motion } from "framer-motion"
import { useState } from "react"

export default function CreateWorkoutModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    bodyParts: [],
    difficulty: "",
    equipment: [],
    instructions: [""],
    tutorialLink: "",
    duration: "",
    calories: "",
    sets: "",
    reps: "",
    restTime: "",
    notes: ""
  })
  const [isSaving, setIsSaving] = useState(false)

  const bodyPartOptions = [
    "chest", "back", "shoulders", "biceps", "triceps", "legs", "glutes", "core", "cardio", "full-body"
  ]

  const equipmentOptions = [
    "bodyweight", "dumbbells", "barbell", "bench", "pull-up-bar", "resistance-bands", "kettlebells", "machine"
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions]
    newInstructions[index] = value
    setFormData(prev => ({ ...prev, instructions: newInstructions }))
  }

  const addInstruction = () => {
    setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ""] }))
  }

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, instructions: newInstructions }))
    }
  }

  const handleCreate = async () => {
    if (!formData.title.trim()) return
    
    setIsSaving(true)
    try {
      const payload = {
        title: formData.title.trim(),
        bodyParts: formData.bodyParts,
        difficulty: formData.difficulty,
        equipment: formData.equipment,
        instructions: formData.instructions.filter(inst => inst.trim() !== ""),
        tutorialLink: formData.tutorialLink || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
        sets: formData.sets ? parseInt(formData.sets) : null,
        reps: formData.reps || null,
        restTime: formData.restTime ? parseInt(formData.restTime) : null,
        notes: formData.notes || null
      }
      
      await onCreate(payload)
    } catch (err) {
      console.error('Create workout error', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-green-100/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Workout</h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workout Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter workout title"
            />
          </div>

          {/* Body Parts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body Parts *</label>
            <div className="grid grid-cols-2 gap-2">
              {bodyPartOptions.map(bodyPart => (
                <label key={bodyPart} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bodyParts.includes(bodyPart)}
                    onChange={() => handleArrayChange("bodyParts", bodyPart)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm capitalize">{bodyPart}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level *</label>
              <select 
                value={formData.difficulty} 
                onChange={(e) => handleInputChange("difficulty", e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select difficulty</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="30"
              />
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
            <div className="grid grid-cols-2 gap-2">
              {equipmentOptions.map(equipment => (
                <label key={equipment} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.equipment.includes(equipment)}
                    onChange={() => handleArrayChange("equipment", equipment)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm capitalize">{equipment.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
              <input
                type="number"
                value={formData.sets}
                onChange={(e) => handleInputChange("sets", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="3"
              />
            </div>

            {/* Reps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
              <input
                type="text"
                value={formData.reps}
                onChange={(e) => handleInputChange("reps", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="8-12"
              />
            </div>

            {/* Rest Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rest Time (seconds)</label>
              <input
                type="number"
                value={formData.restTime}
                onChange={(e) => handleInputChange("restTime", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Calories Burned</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => handleInputChange("calories", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="200"
              />
            </div>

            {/* Tutorial Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutorial Link (YouTube, etc.)</label>
              <input
                type="url"
                value={formData.tutorialLink}
                onChange={(e) => handleInputChange("tutorialLink", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`Step ${index + 1}`}
                />
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="text-green-600 text-sm hover:text-green-700 transition-colors"
            >
              + Add instruction
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Additional notes about the workout..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            disabled={isSaving || !formData.title.trim() || formData.bodyParts.length === 0 || !formData.difficulty}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Creating...' : 'Create Workout'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
