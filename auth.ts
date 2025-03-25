import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { LandingPageRoutes } from "@/types";
import { LoginSchema } from "./schemas";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in environment variables");
}
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM "User" WHERE "email"=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credentials using LoginSchema
        const parsedCredentials = LoginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.log("Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          // Fetch user from DB
          const user = await getUser(email);
          if (!user) {
            console.log("User not found");
            return null;
          }

          // Compare passwords
          const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
          );
          if (!isPasswordValid) {
            console.log("Incorrect password");
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            // name: user.name,
            url: LandingPageRoutes.DASHBOARD,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
});
