"use client";
import { EditPageProfileSkeleton } from "@/app/ui/skeletons";
import { useProfile } from "@/contexts/ProfleContext";
import { DashboardRoutes } from "@/types";
import Link from "next/link";
import { BsBoxArrowUpRight } from "react-icons/bs";
import ProfileUpload from "../ProfileUpload";
import ProfileAvatar from "../ProfileAvatar";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function HeroProfile() {
  const { profile, isLoading, isError } = useProfile();
  const [isUploading, setIsUploading] = useState(false);
  return (
    <div className="relative w-full h-60 bg-teal-900">
      {/* Gray overlay when uploading is true */}
      {isUploading && (
        <div className="fixed inset-0 bg-teal-100 opacity-80 z-50"></div>
      )}

      <div className="absolute top-10 left-16 flex">
        {isLoading ? (
          <EditPageProfileSkeleton />
        ) : (
          <div className="relative w-[100vw] flex items-center gap-16">
            <ProfileAvatar
              profile={profile}
              onEdit={() => setIsUploading(true)}
            />

            {/* Wrap with AnimatePresence to enable exit animation */}
            <AnimatePresence>
              {isUploading && (
                <ProfileUpload
                  profile={profile}
                  onClose={() => setIsUploading(false)}
                />
              )}
            </AnimatePresence>
            <div className="text-white z-20">
              <div className="flex gap-3">
                <div className="text-2xl capitalize">
                  {profile?.firstName} {profile?.lastName}
                </div>
                <Link href={DashboardRoutes.PROFILE}>
                  <BsBoxArrowUpRight className="text-blue-500" />
                </Link>
              </div>
              <div className="text-sm">Email Id: {profile?.email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
