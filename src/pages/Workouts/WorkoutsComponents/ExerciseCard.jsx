"use client"

import { motion } from "framer-motion"
import { Dumbbell, Heart, User, MonitorIcon as Running, Clock, Target, Zap, Timer, ExternalLink, FileText } from "lucide-react"

export default function ExerciseCard({ exercise, index, onViewExercise }) {
  // For backward compatibility with old exercise format and new workout format
  const workoutData = {
    title: exercise.title || exercise.name,
    bodyParts: exercise.bodyParts || [exercise.category],
    difficulty: exercise.difficulty,
    equipment: exercise.equipment || [exercise.equipment],
    instructions: exercise.instructions || [],
    tutorialLink: exercise.tutorialLink,
    duration: exercise.duration,
    calories: exercise.calories,
    sets: exercise.sets,
    reps: exercise.reps,
    restTime: exercise.restTime,
    notes: exercise.notes,
    createdAt: exercise.createdAt,
    updatedAt: exercise.updatedAt
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
        return 'text-green-600 bg-green-50'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50'
      case 'advanced':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-gray-50">
          {renderIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{workoutData.title}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {Array.isArray(workoutData.bodyParts) 
              ? workoutData.bodyParts.slice(0, 2).map(part => (
                  <span key={part} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                    {part}
                  </span>
                ))
              : <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                  {workoutData.bodyParts}
                </span>
            }
            {Array.isArray(workoutData.bodyParts) && workoutData.bodyParts.length > 2 && (
              <span className="text-xs text-gray-500">+{workoutData.bodyParts.length - 2} more</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(workoutData.difficulty)}`}>
            {workoutData.difficulty || 'Not specified'}
          </span>
          {workoutData.duration && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              {workoutData.duration}min
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600">
          {workoutData.sets && workoutData.reps && (
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {workoutData.sets} sets × {workoutData.reps}
            </div>
          )}
          {workoutData.calories && (
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {workoutData.calories} cal
            </div>
          )}
        </div>

        {Array.isArray(workoutData.equipment) && workoutData.equipment.length > 0 && (
          <div className="text-xs text-gray-500">
            Equipment: {workoutData.equipment.slice(0, 2).map(eq => eq.replace('-', ' ')).join(', ')}
            {workoutData.equipment.length > 2 && ` +${workoutData.equipment.length - 2} more`}
          </div>
        )}

        {/* Additional workout details */}
        {workoutData.restTime && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Timer className="h-3 w-3" />
            Rest: {workoutData.restTime}s
          </div>
        )}

        {workoutData.instructions && workoutData.instructions.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FileText className="h-3 w-3" />
            {workoutData.instructions.length} instruction{workoutData.instructions.length > 1 ? 's' : ''}
          </div>
        )}

        {workoutData.tutorialLink && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <ExternalLink className="h-3 w-3" />
            Tutorial available
          </div>
        )}

        {workoutData.notes && (
          <div className="text-xs text-gray-500 line-clamp-2">
            <span className="font-medium">Notes:</span> {workoutData.notes}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onViewExercise(exercise)}
        className="w-full py-2 text-center border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
      >
        View Workout
      </motion.button>
    </motion.div>
  )
}
