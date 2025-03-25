"use client";
import Link from "next/link";
import { useProfile } from "@/contexts/ProfleContext";
import { usePathname } from "next/navigation";
import { lusitana } from "../fonts";

export default function Header() {
  const { profile } = useProfile();
  const pathname = usePathname();

  // Extract page name from pathname
  const pageName = pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, " ") // Replace hyphens with spaces for better readability
    ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Home"; // Capitalize first letter

  return (
    <div className="w-[65rem] text-white">
      <div className="flex h-20 items-center justify-between rounded-md bg-teal-500 p-4 md:h-16">
        <div className={`text-lg font-light ${lusitana.className}`}>{pageName}</div>
        <div className="flex items-center gap-1 border p-1 rounded-lg min-w-36">
          <div className="bg-white text-black w-10 h-10 flex justify-center items-center rounded-full cursor-pointer">
            {profile?.initials || "U"}
          </div>
          <div className="">{profile?.fullName}</div>
        </div>
      </div>
    </div>
  );
}
