"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./UI/sidebar";
import { IconArrowLeft } from "@tabler/icons-react";
import { TbHome } from "react-icons/tb";
import { CgGym } from "react-icons/cg";
import { IoIosNutrition } from "react-icons/io";
import { BsPeople } from "react-icons/bs";
import { GoTrophy } from "react-icons/go";
import { BarChart2, Users, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toastUtils } from "../lib/toastUtils";

import { motion } from "framer-motion";

export default function SidebarDemo() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    // Add confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        toastUtils.success.logout();
        navigate('/');
      } catch (error) {
        toastUtils.error.logoutFailed();
      }
    }
  };

  const links = [
    {
      label: "Home",
      href: "/",
      icon: <TbHome className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Workouts",
      href: "/workouts",
      icon: <CgGym className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Nutrition",
      href: "/nutrition",
      icon: <IoIosNutrition className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Community",
      href: "/community",
      icon: <Users className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Challenges",
      href: "/challenges",
      icon: <GoTrophy className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: <BarChart2 className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
  ];

  // Remove the automatic logout addition to links array

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        
        {/* Bottom section with user profile and logout */}
        {isAuthenticated && (
          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4">
            {/* User Profile Link */}
            <SidebarLink
              link={{
                label: user?.username || "User",
                href: "/profile",
                icon: <User className="h-5 w-5 shrink-0 text-neutral-700" />,
              }}
            />
            
            {/* Logout Button */}
            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                icon: <LogOut className="h-5 w-5 shrink-0 text-red-600" />,
                onClick: handleLogout,
              }}
            />
          </div>
        )}
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black"
      >
        Health UP
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black" />
    </a>
  );
};
