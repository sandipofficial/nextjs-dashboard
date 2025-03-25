"use server";

import postgres from "postgres";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { RequestPasswordResetSchema } from "@/schemas";
import { FormErrors } from "@/types";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export async function requestPasswordResetAction(
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> {
  const data = {
    email: formData.get("email") as string,
  };

  const validation = RequestPasswordResetSchema.safeParse(data);
  if (!validation.success) {
    return {
      email:
        validation.error.flatten().fieldErrors.email?.[0] ||
        "Invalid email format",
    };
  }

  // Check if user exists
  const user = await sql`SELECT * FROM "User" WHERE email=${data.email}`;
  if (user.length === 0) {
    return { email: "User not found" };
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 24 * 3600000); // 1 hour

  await sql`
    UPDATE "User" 
    SET "resetToken"=${resetToken}, "resetTokenExpiry"=${resetTokenExpiry} 
    WHERE email=${data.email}
  `;
  console.log(`Token updated: ${resetToken} : ${resetTokenExpiry}`);

  // Send reset email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log(resetToken);

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}?email=${data.email}`;

  await transporter.sendMail({
    to: data.email,
    subject: "Password Reset Request",
    text: `Click here to reset your password: ${resetLink}`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  // return { errorMsg: "success" };
}
