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
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${formattedDate})
    `;
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
