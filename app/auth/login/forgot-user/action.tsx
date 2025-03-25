"use server";
import { otpVerificationSchema, stepThreeSchema } from "@/schemas";
import { FormErrors } from "@/types";
import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export const sendOtpAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | { email: string }> => {
    const data = Object.fromEntries(formData.entries());

  const validated = otpVerificationSchema.safeParse(data);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {} as FormErrors);
    return errors;
  }
  try {
    const mobileNumber = data.mobileNumber?.toString().trim();
    const user = await sql`SELECT * FROM "User" WHERE "mobileNumber"=${mobileNumber}`;
    if (!user.length) {
      return { message: "User not found" };
    }
    
    return { email: user[0].email }; // Return the user's email
  } catch (error) {
    console.error("Database query failed:", error);
    return { message: "Something went wrong. Please try again." };
  }
};
