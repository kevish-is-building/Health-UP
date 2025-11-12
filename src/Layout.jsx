import React from 'react'
import App from './App'
import Landing from './pages/Landing/Landing.jsx'
import Workouts from './pages/Workouts/Workouts.jsx'
import Nutrition from './pages/Nutrition/Nutrition.jsx'
import Community from './pages/Community/Community.jsx'
import Challenges from './pages/Challenges/Challenges.jsx'
import { Routes, Route } from 'react-router-dom'
import Leaderboard from './pages/Leaderboard/Leaderboard.jsx'
import Dashboard  from "./pages/Dashboard/Dashboard.jsx"
import Auth from './pages/Auth/Auth.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function Layout() {
  return (
    <Routes>
      {/* Auth routes - without App wrapper */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      
      {/* Public routes - with App wrapper */}
      <Route path="/" element={<App><Landing /></App>} />
      
      {/* Protected routes - with App wrapper and authentication */}
      <Route path="/workouts" element={
        <ProtectedRoute>
          <App><Workouts /></App>
        </ProtectedRoute>
      } />
      <Route path="/nutrition" element={
        <ProtectedRoute>
          <App><Nutrition /></App>
        </ProtectedRoute>
      } />
      <Route path="/community" element={
        <ProtectedRoute>
          <App><Community /></App>
        </ProtectedRoute>
      } />
      <Route path="/challenges" element={
        <ProtectedRoute>
          <App><Challenges /></App>
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <App><Leaderboard /></App>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <App><Dashboard /></App>
        </ProtectedRoute>
      } />
    </Routes>
  )
}