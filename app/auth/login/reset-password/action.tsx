"use server";

import { ResetPasswordSchema } from "@/schemas"; // Define a schema for validation
import { FormErrors } from "@/types";
import bcrypt from "bcryptjs";
import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export const resetPasswordAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  // Convert FormData to an object
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  // Validate input using a schema
  const validated = ResetPasswordSchema.safeParse(data);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});

    return errors;
  }

  const { email, token, password } = validated.data;

  try {
    // Check if the token is valid and not expired
    const user = await sql<
      { id: number; resetToken: string | null; resetTokenExpiry: Date | null }[]
    >`
      SELECT id, "resetToken", "resetTokenExpiry" FROM "User" WHERE "email"=${email} AND "resetToken"=${token}
    `;
    console.log(user);

    if (user.length === 0 || !user[0].resetToken) {
      return { errorMsg: "Invalid or expired reset token." };
    }

    // console.log("Stored resetTokenExpiry:", user[0].resetTokenExpiry);
    // console.log("Converted Date:", new Date(user[0].resetTokenExpiry));
    // console.log("Current Date:", new Date());

    if (
      !user[0].resetTokenExpiry ||
      new Date(user[0].resetTokenExpiry) < new Date()
    ) {
      return { errorMsg: "Reset token has expired. Please request a new one." };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password & clear reset token
    await sql`
      UPDATE "User" 
      SET "passwordHash"=${hashedPassword}, "resetToken"=NULL, "resetTokenExpiry"=NULL 
      WHERE id=${user[0].id}
    `;

    return { successMsg: "Password reset successful!" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { errorMsg: "Unexpected error. Please try again." };
  }
};
