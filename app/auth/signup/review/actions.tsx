"use server";
import {
  NewSignUpType,
  stepTwoSchema,
  stepOneSchema,
  stepThreeSchema,
} from "@/schemas";
import { SignupRoutes } from "@/types";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

interface SubmitDealActionReturnType {
  redirect?: SignupRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitDealAction = async (
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
      redirect: SignupRoutes.BASIC_DETAILS,
      errorMsg: "Please validate coupon details.",
    };
  }

  const stepThreeValidated = stepThreeSchema.safeParse(SignupData);
  if (!stepThreeValidated.success) {
    return {
      redirect: SignupRoutes.BASIC_DETAILS,
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
    address_country,
    address_city,
    address_state,
    address_zipCode,
  } = SignupData;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    // Insert the user data into the database
    await sql`
      INSERT INTO users (
        first_name, last_name, email, password, mobile_number, initials, dob, gender, profile_picture_url,
        address_street, address_country, address_city, address_state, address_zipCode, role_id, kyc_status, 
        pan_number, preferred_language, created_at, updated_at, last_login_at, is_active, is_verified, 
        login_attempts, saved_cards
      )
      VALUES (
        ${firstName}, ${lastName}, ${email}, ${hashedPassword}, ${mobileNumber}, ${initials}, ${dateOfBirth}, ${gender}, 
        NULL, ${address_street}, ${address_country}, ${address_city}, ${address_state}, ${address_zipCode}, 
        uuid_generate_v4(), 'Pending', NULL, 'English', NOW(), NOW(), NULL, TRUE, FALSE, 0, ARRAY[]::TEXT[]
      )
      ON CONFLICT (email) DO NOTHING;
    `;

    console.log("User successfully created!");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(
      "An error occurred while creating the user. Please try again."
    );
  }

  const retVal = { success: true, redirect: SignupRoutes.BASIC_DETAILS };
  console.log(retVal);
  return retVal;
};
