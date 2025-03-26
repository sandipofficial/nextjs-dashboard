"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateProfile(userId: number, field: string, value: string) {
  try {
    // Validate allowed fields to prevent SQL Injection
    const allowedFields = ["fullName", "gender", "country", "dob"];
    if (!allowedFields.includes(field)) {
      throw new Error("Invalid field update.");
    }

    // Update the field dynamically
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { [field]: value },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile." };
  }
}
