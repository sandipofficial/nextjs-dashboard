"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/utils";

export type Profile = {
  fullName: string;
  email: string;
  initials: string;
  mobileNumber: string;
  gender: string | null;
  dob: string | null;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  lastLoginAt: string | null;
  kycStatus: string;
  country: string | null;
};

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  isError: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ userId, children }: { userId: number; children: React.ReactNode }) {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
  });

  return (
    <ProfileContext.Provider value={{ profile: profile ?? null, isLoading, isError }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
