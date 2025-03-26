"use server";
import {
  NewSignUpType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchema,
} from "@/schemas";
import { LandingPageRoutes, SignupRoutes } from "@/types";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

interface SubmitDealActionReturnType {
  redirect?: SignupRoutes | LandingPageRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitReviewAction = async (
  SignupData: NewSignUpType
): Promise<SubmitDealActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(SignupData);
  if (!stepOneValidated.success) {
    return {
      redirect: SignupRoutes.BASIC_DETAILS,
      errorMsg: "Please validate product info.",
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(SignupData);
  if (!stepTwoValidated.success) {
    return {
      redirect: SignupRoutes.ADDRESS_DEATILS,
      errorMsg: "Please validate coupon details.",
    };
  }

  const stepThreeValidated = stepThreeSchema.safeParse(SignupData);
  if (!stepThreeValidated.success) {
    return {
      redirect: SignupRoutes.OTP_DEATAILS,
      errorMsg: "Please validate contact info.",
    };
  }

  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    password,
    mobileNumber,
    address_street,
    address_city,
    address_state,
    address_country,
    address_zipCode,
  } = SignupData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const initials =
      firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

    // Insert user into database
    const [user] = await sql`
      INSERT INTO "User" (
        "firstName", "lastName", "email", "passwordHash", "mobileNumber", "initials", "dob", "gender",
        "preferredLanguage", "panNumber", "createdAt", "updatedAt", "isActive", "isVerified", "roleId", "kycStatus"
      )
      VALUES (
        ${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${mobileNumber}, ${initials}, ${dateOfBirth}, ${gender}, 
        'English', NULL, NOW(), NOW(), TRUE, FALSE, 2, 'Pending'
      )
      ON CONFLICT ("email") DO NOTHING
      RETURNING id;
    `;

    if (!user) {
      console.log("User already exists.");
      return {
        errorMsg: "User already exists.",
        redirect: SignupRoutes.BASIC_DETAILS,
      };
    }

    // Insert user address
    await sql`
      INSERT INTO "Address" (
        "userId", "street", "city", "state", "country", "zipCode"
      )
      VALUES (
        ${user.id}, ${address_street}, ${address_city}, ${address_state}, ${address_country}, ${address_zipCode}
      );
    `;

    console.log("User successfully created!");
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "23505") {
      return { success: false, errorMsg: "Mobile number already exists. Please use a different number." };
    }
    throw new Error(
      "An error occurred while creating the user. Please try again."
    );
  }

  return { success: true, redirect: LandingPageRoutes.LOGIN };
};
