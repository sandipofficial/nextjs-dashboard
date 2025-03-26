"use client";
import Link from "next/link";
import { useProfile } from "@/contexts/ProfleContext";
import { usePathname } from "next/navigation";
import { lusitana } from "../fonts";
import { KycInfoSkeleton, ProfileNameSkeleton } from "../skeletons";
import ProfileInfo from "./Header/profileInfo";
import KycInfo from "./Header/kycInfo";

export default function Header() {
  const { profile, isLoading, isError } = useProfile();
  const pathname = usePathname();

  // Extract page name from pathname
  const pageName =
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ") // Replace hyphens with spaces
      ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Home"; // Capitalize

  return (
    <div className="w-[65rem] text-white">
      <div className="flex h-20 items-center justify-between rounded-md bg-teal-500 p-2 md:h-16">
        <div className={`text-lg font-light ${lusitana.className}`}>
          {pageName}
        </div>

        <div className="flex gap-3 items-center justify-center">
          {/* KYC Info */}
          <div>
            {isLoading ? (
              <KycInfoSkeleton />
            ) : isError ? (
              <div className="text-red-500">Failed to load KYC Info</div>
            ) : (
              <KycInfo />
            )}
          </div>

          {/* Profile Info */}
          <div>
            {isLoading ? (
              <ProfileNameSkeleton />
            ) : isError ? (
              <div className="text-red-500">Failed to load profile</div>
            ) : (
              <ProfileInfo />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
