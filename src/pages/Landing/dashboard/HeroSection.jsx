import React from "react";
import { MdSportsGymnastics } from "react-icons/md";
import { FiPlay } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const HeroSection = ({ SidebarToggle }) => {
  const { isAuthenticated } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Top Navigation with Auth Button */}
      {!isAuthenticated && (
        <div className="absolute top-4 right-4 z-10">
          <Link to="/auth">
            <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-200">
              Login / Sign Up
            </button>
          </Link>
        </div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div className="max-w-lg">
            <motion.div
              className="hero-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
              >
                Track, <span className="text-emerald-600">Improve,</span>
                <br />
                <span className="text-emerald-600">Transform</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-4 text-lg text-gray-600"
              >
                Your all-in-one fitness companion for tracking workouts,
                nutrition, and connecting with a community that keeps you
                motivated.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap gap-4"
              >
                {isAuthenticated ? (
                  <>
                    <Link to="/workouts">
                      <button
                        onClick={SidebarToggle}
                        className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-200 cursor-pointer"
                      >
                        Go to Workouts
                      </button>
                    </Link>
                    <Link to="/challenges">
                      <button className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-lg shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-all duration-200 flex items-center cursor-pointer">
                        <MdSportsGymnastics className="h-4 w-4 mr-2"/>
                        Take a Challenge
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <button className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-200 cursor-pointer">
                        Get Started
                      </button>
                    </Link>
                    <button className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-lg shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-all duration-200 flex items-center cursor-pointer">
                      <FiPlay className="h-4 w-4 mr-2"/>
                      Learn More
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
          {/* Right content - Phone mockup */}
          <div className="relative flex justify-center">
            <img
              src="https://plus.unsplash.com/premium_photo-1670505062582-fdaa83c23c9e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29ya291dHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Fitness app on smartphone"
              className="rounded-xl shadow-2xl max-w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;