import { z } from "zod";

export const stepOneSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Please enter a valid email."),
    gender: z.enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Please select a valid gender." }),
    }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[\W_]/,
        "Password must contain at least one special character (e.g. @, #, $, %, etc.)."
      ),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[\W_]/,
        "Password must contain at least one special character (e.g. @, #, $, %, etc.)."
      ),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Please enter a valid date of birth.",
    }),
    mobileNumber: z
      .string()
      .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match.",
        path: ["confirmPassword"],
      });
    }
  });

export const stepTwoSchema = z.object({
  address_street: z.string().min(1, "Street is required"),
  address_city: z.string().min(1, "City is required"),
  address_state: z.string().min(1, "State is required"),
  address_country: z.string().min(1, "Country is required"),
  address_zipCode: z
    .string()
    .min(5, "Zip code must be at least 5 characters long"),
});

export const stepThreeSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

export const newSignUpSchema = z.object({
  ...stepOneSchema.innerType().shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
});

export const newSignUpInitialValuesSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  dateOfBirth: z.string().optional(),
  mobileNumber: z.string().optional(),
  otp: z.string().optional(),
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_country: z.string().optional(),
  address_zipCode: z.string().optional(),
});

export type NewSignUpType = z.infer<typeof newSignUpSchema>;
export type NewSignUpInitialValuesType = z.infer<
  typeof newSignUpInitialValuesSchema
>;

// Login Validation Schema
export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
  .string()
  .min(8, "Confirm Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[\W_]/,
    "Password must contain at least one special character (e.g. @, #, $, %, etc.)."
  ),
});

// Login Initial Values Schema (for form default values)
export const LoginInitialValuesSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[\W_]/,
      "Password must contain at least one special character (e.g. @, #, $, %, etc.)."
    ),
});

export type LoginType = z.infer<typeof LoginSchema>;
export type LoginInitialValuesType = z.infer<typeof LoginInitialValuesSchema>;


export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// export type RequestPasswordResetType = z.infer<typeof RequestPasswordResetSchema>;


export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"), // Ensure token is provided
  email: z.string().email("Invalid email format"), // Ensure email is valid
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password cannot exceed 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export const otpVerificationSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

