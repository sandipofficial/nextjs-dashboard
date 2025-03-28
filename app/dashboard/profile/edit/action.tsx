"use server";

import { PrismaClient } from "@prisma/client";
import { stepOneSchema } from "@/schemas"; // Import the validation schema
import { z } from "zod";
import { supabase } from "@/supabaseClient";

const prisma = new PrismaClient();

// Define validation rules for updatable fields
const fieldSchemas: Record<string, z.ZodTypeAny> = {
  firstName: stepOneSchema.innerType().shape.firstName,
  lastName: stepOneSchema.innerType().shape.lastName,
  email: stepOneSchema.innerType().shape.email,
  gender: stepOneSchema.innerType().shape.gender,
  dob: stepOneSchema.innerType().shape.dob,
  mobileNumber: stepOneSchema.innerType().shape.mobileNumber,
};

export async function updateProfile(
  userId: number,
  field: string,
  value: string
) {
  try {
    console.log("Field being updated:", field);
    console.log("Allowed fields:", Object.keys(fieldSchemas));

    // Ensure the field exists in allowed fields
    if (!(field in fieldSchemas)) {
      throw new Error("Invalid field update.");
    }

    // Validate the field value
    const schema = fieldSchemas[field];
    const validated = schema.safeParse(value);
    if (!validated.success) {
      return { success: false, error: validated.error.format() };
    }

    // Prevent password updates for security reasons
    if (field === "password" || field === "confirmPassword") {
      return {
        success: false,
        error: "Password update is not allowed directly.",
      };
    }

    let updateData: any = value;

    // Convert date string to Date object if updating 'dob'
    if (field === "dob") {
      updateData = new Date(value);
    }

    // Update the field in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { [field]: updateData },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: `Failed to update ${field}.` };
  }
}

// export async function uploadProfile(userId: number, file: File) {
//   // Ensure the user is authenticated
//   // const {
//   //   data: { user },
//   // } = await supabase.auth.getUser();
//   // if (!user) throw new Error("User not authenticated");

//   if (!file) throw new Error("No file uploaded");

//   const fileName = `profile-${userId}-${Date.now()}.${file.name
//     .split(".")
//     .pop()}`;
//   const { data, error } = await supabase.storage
//     .from("profile-pictures")
//     .upload(fileName, file, {
//       cacheControl: "3600",
//       upsert: true,
//     });

//   if (error) throw new Error(`Upload failed: ${error.message}`);

//   // Get public URL
//   const { data: urlData } = supabase.storage
//     .from("profile-pictures")
//     .getPublicUrl(fileName);
//   const profileUrl = urlData.publicUrl;

//   // Update user profile URL in the database
//   await prisma.user.update({
//     where: { id: userId },
//     data: { profileUrl: profileUrl },
//   });

//   // revalidatePath("/profile"); // Ensure UI updates
//   return profileUrl;
// }

// "use server";

import { writeFile } from "fs/promises";
import path from "path";
// import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadProfile(userId: number, file: File) {
  if (!file) throw new Error("No file provided");

  try {
    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const fileName = `${userId}-${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    // Read file content and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Construct file URL
    const fileUrl = `/uploads/${fileName}`;

    // Save to the database
    await prisma.user.update({
      where: { id: userId },
      data: { profileUrl: fileUrl },
    });

    // Revalidate cache
    revalidatePath("/dashboard/profile");

    return fileUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("File upload failed");
  }
}
