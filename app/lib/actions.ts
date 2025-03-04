"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { updateRevenue } from "./data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });


 const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." })
      .regex(/^[A-Za-z]+$/, { message: "First name can only contain letters." }),

    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." })
      .regex(/^[A-Za-z]+$/, { message: "Last name can only contain letters." }),

    email: z
      .string()
      .email({ message: "Please enter a valid email address." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, { message: "Password must contain at least one special character." }),

    confirmPassword: z.string(),

    mobileNumber: z
      .string()
      .regex(/^\d{10}$/, { message: "Mobile number must be exactly 10 digits." }),

    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date of Birth must be in YYYY-MM-DD format." }),

    gender: z.enum(["Male", "Female", "Other"]).optional(),

    profilePictureUrl: z.string().url({ message: "Invalid profile picture URL." }).optional(),

    address: z
      .object({
        street: z.string().min(3, { message: "Street must be at least 3 characters long." }),
        city: z.string().min(2, { message: "City must be at least 2 characters long." }),
        state: z.string().min(2, { message: "State must be at least 2 characters long." }),
        country: z.string().min(2, { message: "Country must be at least 2 characters long." }),
        zipCode: z.string().regex(/^\d{5,6}$/, { message: "Zip code must be 5 or 6 digits." }),
      }),

    roleId: z.string().uuid({ message: "Invalid role ID format." }),

    panNumber: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Invalid PAN number format." })
      .optional(),

    preferredLanguage: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });



const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.coerce.date({
    invalid_type_error: "Please select a valid date.",
  }),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    date?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true });

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    date: formData.get("date"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status, date } = validatedFields.data;
  const amountInCents = amount * 100;
  const formattedDate = date || new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    const user = await sql<{ id: string }[]>`
        SELECT id FROM users WHERE customer_id = ${customerId} LIMIT 1;
    `;

    if (user.length === 0) {
        return { message: "User not found for given customer_id." };
    }

    const userId = user[0].id; // Extract user_id

    await sql`
      INSERT INTO invoices (customer_id, user_id, amount, status, date)
      VALUES (${customerId}, ${userId}, ${amountInCents}, ${status}, ${formattedDate})
    `;

    console.log("✅ Invoice created successfully.");
} catch (error) {
    return {
        message: "Database Error: Failed to Create Invoice.",
        error,
    };
}


  await updateRevenue();
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

//   updateInvoice
const UpdateInvoice = FormSchema.omit({ id: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    date: formData.get("date"), // Include date
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  // Prepare data for updating the database
  const { customerId, amount, status, date } = validatedFields.data;
  const amountInCents = amount * 100;
  const formattedDate = date || new Date().toISOString().split("T")[0];

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${formattedDate}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  await updateRevenue();
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Delete function remains unchanged
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  await updateRevenue();
  revalidatePath("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const FormSchemaCustomer = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "This field is required." }),
  email: z
    .string()
    .min(1, { message: "This field is required." })
    .email({ message: "Please enter a valid email." }),
  image_url: z.string(), // No validation applied
});

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

const CreateCustomer = FormSchemaCustomer.omit({ id: true });

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData
): Promise<CustomerState> {
  // Validate form using Zod
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  });

  // If validation fails, return updated state with errors and message.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  // Prepare data for insertion into the database
  const { name, email, image_url } = validatedFields.data;

  // Insert data into the database
  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    // If a database error occurs, return a specific error message.
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }

  // After successful insertion, you may want to clear errors and set a success message.
  // The following lines will revalidate the customers page and redirect:
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

//   updateCustomer
const UpdateCustomer = FormSchemaCustomer.omit({ id: true });

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData
): Promise<CustomerState> {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  });

  // If validation fails, return updated state with errors and message.
  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  // Prepare data for insertion into the database
  const { name, email, image_url } = validatedFields.data;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}
      WHERE id = ${id}
    `;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { message: "Database Error: Failed to Update Customer." };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

//delete
export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath("/dashboard/customers");
}

//signup


export type SignupState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
};

const CreateUser = SignupFormSchema.omit({ id: true });

export async function createUser(prevState: SignupState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check the form for errors.",
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Here you would typically hash the password and create the user in your database
    const hashedPassword = await bcrypt.hash(password, 10);
    // await db.user.create({ data: { name, email, password: hashedPassword } })
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;

    // For demo purposes, we'll just simulate a delay
    // await new Promise((resolve) => setTimeout(resolve, 1000))
  } catch (error) {
    return {
      message: "Database Error: Failed to create user.",
    };
  }

  revalidatePath("/auth/login");
  redirect("/auth/login"); // Redirect to dashboard after successful signup
}
