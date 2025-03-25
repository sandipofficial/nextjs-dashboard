"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link"; // Import Next.js Link
import { Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Menu items array with href links
const menuItems = [
  { name: "Profile", href: "/profile" },
  { name: "Account", href: "/account" },
  { name: "Notifications", href: "/notifications" },
];

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  // Handle click outside to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Add event listener when menu is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Settings Button */}
      <div
        className="flex items-center h-[48px] gap-1 px-3 py-2 cursor-pointer bg-white  rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="hover:text-teal-500 flex gap-2">
          <Settings className="w-6 " />
          <span className="font-medium">Settings</span>
        </div>

        {/* Rotating Chevron Animation */}
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 15.25a.75.75 0 0 1-.53-.22l-4.5-4.5a.75.75 0 1 1 1.06-1.06L12 13.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-.53.22Z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </div>

      {/* AnimatePresence ensures smooth closing animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }} // Exit animation for smooth closing
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute right-2 bottom-full mb-2 w-44 shadow-lg rounded-lg border p-2 bg-white"
          >
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="px-3 py-1 hover:text-teal-500 cursor-pointer"
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
