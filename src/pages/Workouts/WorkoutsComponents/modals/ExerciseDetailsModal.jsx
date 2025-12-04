"use client"

import { motion } from "framer-motion"
import { Dumbbell, Heart, User, MonitorIcon as Running, Clock, Target, Zap, ExternalLink } from "lucide-react"

export default function ExerciseDetailsModal({ exercise, onClose, onAddToWorkout, onWatchTutorial }) {
  // For backward compatibility with old exercise format and new workout format
  const workoutData = {
    title: exercise.title || exercise.name,
    bodyParts: exercise.bodyParts || [exercise.category],
    difficulty: exercise.difficulty,
    equipment: exercise.equipment || [exercise.equipment],
    instructions: exercise.instructions || [exercise.instructions],
    tutorialLink: exercise.tutorialLink,
    duration: exercise.duration,
    calories: exercise.calories,
    sets: exercise.sets,
    reps: exercise.reps,
    restTime: exercise.restTime,
    notes: exercise.notes
  }

  // Function to render the appropriate icon based on body parts
  const renderIcon = () => {
    const primaryBodyPart = Array.isArray(workoutData.bodyParts) 
      ? workoutData.bodyParts[0]?.toLowerCase() 
      : workoutData.bodyParts?.toLowerCase() || 'chest'
    
    if (primaryBodyPart.includes('cardio') || primaryBodyPart.includes('running')) {
      return <Running className="h-6 w-6 text-blue-500" />
    } else if (primaryBodyPart.includes('chest') || primaryBodyPart.includes('shoulders')) {
      return <Dumbbell className="h-6 w-6 text-green-500" />
    } else if (primaryBodyPart.includes('core') || primaryBodyPart.includes('abs')) {
      return <Target className="h-6 w-6 text-purple-500" />
    } else if (primaryBodyPart.includes('full-body')) {
      return <Heart className="h-6 w-6 text-red-500" />
    } else {
      return <Dumbbell className="h-6 w-6 text-green-500" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'advanced':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
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
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gray-50">
              {renderIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{workoutData.title}</h2>
              <div className="flex flex-wrap gap-1 mt-1">
                {Array.isArray(workoutData.bodyParts) 
                  ? workoutData.bodyParts.map(part => (
                      <span key={part} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                        {part}
                      </span>
                    ))
                  : <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                      {workoutData.bodyParts}
                    </span>
                }
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(workoutData.difficulty)}`}>
              {workoutData.difficulty || 'Not specified'}
            </div>
          </div>
          
          {workoutData.duration && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{workoutData.duration} min</span>
              </div>
            </div>
          )}
          
          {workoutData.sets && workoutData.reps && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">{workoutData.sets} × {workoutData.reps}</span>
              </div>
            </div>
          )}
          
          {workoutData.calories && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-gray-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">{workoutData.calories} cal</span>
              </div>
            </div>
          )}
        </div>

        {/* Equipment */}
        {Array.isArray(workoutData.equipment) && workoutData.equipment.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {workoutData.equipment.map((item, index) => (
                <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm capitalize">
                  {item.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {Array.isArray(workoutData.instructions) && workoutData.instructions.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Instructions</h3>
            <ol className="space-y-2">
              {workoutData.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-gray-600 text-sm">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Rest Time */}
        {workoutData.restTime && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Rest Time Between Sets</h3>
            <p className="text-gray-600 text-sm">{workoutData.restTime} seconds</p>
          </div>
        )}

        {/* Notes */}
        {workoutData.notes && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Additional Notes</h3>
            <p className="text-gray-600 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              {workoutData.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium cursor-pointer"
            onClick={onAddToWorkout}
          >
            Add to Routine
          </motion.button>

          {workoutData.tutorialLink ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
              onClick={() => window.open(workoutData.tutorialLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Watch Tutorial
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              onClick={onWatchTutorial}
            >
              Search Tutorial
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}