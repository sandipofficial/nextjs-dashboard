"use server";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import postgres from "postgres";
import { Profile } from "@/contexts/ProfleContext";

// if (!process.env.POSTGRES_URL) {
//   throw new Error("POSTGRES_URL is not defined in environment variables");
// }
// const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
export async function fetchProfile(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
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
      },
    });

    if (!user) return null;

    return {
      fullName: `${user.firstName} ${user.lastName}`,
      initials: user.initials,
      email: user.email,
      mobileNumber: user.mobileNumber,
      gender: user.gender,
      dob: user.dob,
      isActive: user.isActive,
      isVerified: user.isVerified,
      role: user.role.name,
      lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : null,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
