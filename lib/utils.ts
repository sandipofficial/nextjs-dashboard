"use server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import postgres from "postgres";
import { Profile } from "@/contexts/ProfleContext";

// if (!process.env.POSTGRES_URL) {
//   throw new Error("POSTGRES_URL is not defined in environment variables");
// }
// const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export async function getProfile(userId: string): Promise<Profile | null> {

//   const numericUserId = parseInt(userId, 10);

//   try {
//     const result = await sql`SELECT * FROM User WHERE "id" = ${numericUserId};`;

//     if (!result || result.length === 0) {
//       return null; // No user found
//     }

//     const row = result[0];

//     // Ensure the returned object matches the Profile type
//     return {
//       name: row.name as string,
//       email: row.email as string,
//       mobileNumber: row.mobile_number as string, // Ensure field names match the database
//     };
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     return null;
//   }
// }

import { prisma } from "./prisma";

/**
 * Fetches user profile details from the database.
 */
const countryMapping: Record<string, string> = {
  IN: "India",
  US: "United States",
  UK: "United Kingdom",
  CA: "Canada",
  DE: "Germany",
  FR: "France",
  // Add more countries as needed
};

export async function fetchProfile(emailId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: emailId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        initials: true,
        email: true,
        mobileNumber: true,
        gender: true,
        dob: true,
        isActive: true,
        isVerified: true,
        role: { select: { name: true } }, // Fetch role name
        lastLoginAt: true,
        kycStatus: true,
        address: { select: { country: true } }, // Fetch country from address table
        profileUrl: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      initials: user.initials,
      email: user.email,
      mobileNumber: user.mobileNumber,
      gender: user.gender,
      dob: user.dob ? new Date(user.dob).toDateString() : null,
      isActive: user.isActive,
      isVerified: user.isVerified,
      role: user.role.name,
      lastLoginAt: user.lastLoginAt
        ? new Date(user.lastLoginAt).toISOString()
        : null,
      kycStatus: user.kycStatus,
      country: user.address?.country
        ? countryMapping[user.address.country] || user.address.country
        : null,
      profileUrl: user.profileUrl,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
