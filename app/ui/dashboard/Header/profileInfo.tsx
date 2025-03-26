"use client";

import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/contexts/ProfleContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardRoutes } from "@/types";

const menuItems = [
  { name: "Profile", href: DashboardRoutes.PROFILE },
  { name: "Account", href: "/account" },
  { name: "Notifications", href: "/notifications" },
];

export default function ProfileInfo() {
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Profile Button (Click to Toggle Dropdown) */}
      <div
        className="flex items-center gap-2 border p-1 text-sm rounded-lg min-w-36 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-white text-black w-10 h-10 flex justify-center items-center rounded-full">
          {profile?.initials}
        </div>
        <div>{profile?.fullName}</div>

   
      </div>

      {/* Dropdown Menu (Appears Below the Profile Section) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute right-0 mt-2 w-32 shadow-lg rounded-lg border p-2 bg-white"
          >
            <ul className="space-y-1 ">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="px-2 py-1 hover:text-teal-500 text-black cursor-pointer"
                >
                  <Link href={item.href} className="block w-full h-full">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
