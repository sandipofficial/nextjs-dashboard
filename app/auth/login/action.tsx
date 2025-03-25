"use server";

import { LoginSchema } from "@/schemas";
import { FormErrors, SignupRoutes } from "@/types";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { LandingPageRoutes } from "@/types";
import { TrendingUp } from "lucide-react";
import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

export const loginAction = async (
  prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  // Convert FormData to an object
  const data = Object.fromEntries(formData.entries());

  // Validate using LoginSchema
  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});

    return errors;
  }

  try {
    const result = await signIn("credentials", {
      ...validated.data,
      redirect: false, // Prevent automatic redirect
    });

    console.log(result);
    const email = validated.data.email;
    if (!result?.error) {
      await sql`
        UPDATE "User"
        SET 
          "lastLoginAt" = NOW(), 
          "loginAttempts" = "loginAttempts" + 1
        WHERE "email" = ${email};
      `;
    }
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { errorMsg: "Invalid credentials. Try again." };
    }
    return { errorMsg: "Unexpected error. Please try again." };
  }
};
