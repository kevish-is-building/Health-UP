"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../contexts/AuthContext"
import { AnimatePresence } from "framer-motion"
import { toastUtils } from "../../../lib/toastUtils"
import Header from "./Header"
import Stats from "./Stats"
import FeaturedPrograms from "./FeaturedPrograms"
import ExerciseLibrary from "./ExerciseLibrary"
import CreateWorkoutModal from "./modals/CreateWorkoutModal"
import ProgramDetailsModal from "./modals/ProgramDetailsModal"
import ExerciseDetailsModal from "./modals/ExerciseDetailsModal"

// Featured programs data
const featuredPrograms = [
  {
    id: 1,
    title: "Elite Strength Program",
    description: "A comprehensive strength training program designed for experienced athletes.",
    image: "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    premium: true,
    weeks: 12,
    level: "Advanced",
    coach: "Coach Mike",
    coachAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    title: "HIIT Cardio Challenge",
    description: "High-intensity interval training to boost your cardiovascular fitness.",
    image: "https://images.pexels.com/photos/6296010/pexels-photo-6296010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    premium: false,
    weeks: 8,
    level: "Beginner",
    coach: "Sarah Lee",
    coachAvatar: "https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    title: "Mobility & Flexibility",
    description: "Improve your range of motion and prevent injuries with guided routines.",
    image: "https://images.pexels.com/photos/6832078/pexels-photo-6832078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    premium: true,
    weeks: 6,
    level: "Intermediate",
    coach: "Emma Chen",
    coachAvatar: "https://images.pexels.com/photos/4498364/pexels-photo-4498364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
]

// Exercise library data
const exercises = [
  {
    id: 1,
    name: "Bench Press",
    category: "Chest, Shoulders, Triceps",
    iconType: "dumbbell",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    instructions:
      "Lie on a bench, grip the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, then push it back up.",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    id: 2,
    name: "Squat Jumps",
    category: "Legs, Core, Cardio",
    iconType: "running",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    instructions:
      "Start in a squat position, explosively jump upward, land softly back in the squat position, and repeat.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    name: "Pull-ups",
    category: "Back, Biceps, Core",
    iconType: "user",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    instructions:
      "Hang from a bar with palms facing away from you, pull your body up until your chin is over the bar, then lower back down with control.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    id: 4,
    name: "Burpees",
    category: "Full Body, Cardio",
    iconType: "heart",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    instructions:
      "Start standing, drop into a squat position, kick feet back into a plank, do a push-up, jump feet back to squat, then explosively jump up with arms overhead.",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
]

export default function WorkoutLibrary() {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("")

  // State for workout creation modal
  const [showCreateModal, setShowCreateModal] = useState(false)

  // State for program details modal
  const [selectedProgram, setSelectedProgram] = useState(null)

  // State for exercise details modal
  const [selectedExercise, setSelectedExercise] = useState(null)

  // State for stats with counter animation
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    caloriesBurned: 0,
    achievements: 0,
  })

  // Workouts from backend
  const [workouts, setWorkouts] = useState([])
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Animate stats on component mount
  useEffect(() => {
    const targetStats = {
      totalWorkouts: 152,
      totalDuration: 45.5,
      caloriesBurned: 12450,
      achievements: 24,
    }

    const duration = 2000 // 2 seconds for the animation
    const steps = 60
    const interval = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        totalWorkouts: Math.round(progress * targetStats.totalWorkouts),
        totalDuration: Number.parseFloat((progress * targetStats.totalDuration).toFixed(1)),
        caloriesBurned: Math.round(progress * targetStats.caloriesBurned),
        achievements: Math.round(progress * targetStats.achievements),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  // Fetch workouts for the logged-in user
  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!isAuthenticated) {
        setWorkouts([])
        return
      }

      setIsLoadingWorkouts(true)
      try {
        const { default: api } = await import("../../../lib/workouts")
        const data = await api.getWorkouts({ page: 1, limit: 50 })
        // Expect data to be { items: [], meta: {} } or an array
        const raw = data.items || data.workouts || data || []
        const items = raw.map((it) => ({ ...it, id: it.id || it._id }))
        setWorkouts(items)
      } catch (err) {
        console.error('Failed to load workouts', err)
      } finally {
        setIsLoadingWorkouts(false)
      }
    }

    fetchWorkouts()
  }, [isAuthenticated])

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Header Component */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateWorkout={() => setShowCreateModal(true)}
      />

      {/* Stats Component */}
      <Stats stats={stats} />
      
      {/* Exercise Library Component - if user has workouts show them, otherwise show default library */}
      {isLoadingWorkouts ? (
        <div className="py-8 text-center text-gray-500">Loading workouts...</div>
      ) : (
        <>
          {isAuthenticated && workouts.length === 0 ? (
            <div className="py-8 text-center text-gray-600">You don't have any saved workouts yet. Create one to see it here.</div>
          ) : (
            <ExerciseLibrary
              exercises={workouts.length > 0 ? workouts : filteredExercises}
              onViewExercise={(exercise) => setSelectedExercise(exercise)}
            />
          )}
        </>
      )}

      {/* Featured Programs Component */}
      <FeaturedPrograms programs={featuredPrograms} onViewProgram={(program) => setSelectedProgram(program)} />


      {/* Create Workout Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateWorkoutModal
            onClose={() => setShowCreateModal(false)}
            onCreate={async (payload) => {
              try {
                const { createWorkout } = await import("../../../lib/workouts")
                await createWorkout(payload)
                // refresh
                const { default: api } = await import("../../../lib/workouts")
                const data = await api.getWorkouts({ page: 1, limit: 50 })
                const raw2 = data.items || data.workouts || data || []
                const items2 = raw2.map((it) => ({ ...it, id: it.id || it._id }))
                setWorkouts(items2)
                setShowCreateModal(false)
                toastUtils.success.workoutSaved()
              } catch (err) {
                console.error('Create workout failed', err)
                toastUtils.error.saveFailed('Workout')
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Program Details Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <ProgramDetailsModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onStart={() => {
              setSelectedProgram(null)
              alert(
                `${selectedProgram.premium ? "Premium program unlocked!" : "Free program started!"} Enjoy your ${selectedProgram.title}!`,
              )
            }}
          />
        )}
      </AnimatePresence>

      {/* Exercise Details Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetailsModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onAddToWorkout={() => {
              setSelectedExercise(null)
              alert(`Added ${selectedExercise.name} to your workout!`)
            }}
            onWatchTutorial={() => {
              setSelectedExercise(null)
              alert(`Watching tutorial for ${selectedExercise.name}`)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
