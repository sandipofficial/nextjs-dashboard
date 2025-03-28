import type { NextAuthConfig } from "next-auth";
import { LandingPageRoutes } from "./types";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: LandingPageRoutes.LOGIN,
  },
  debug: true,
  // session: {
  //   strategy: "jwt",
  //   maxAge: 60 * 30, // 30 minutes
  // },
  // jwt: {
  //   maxAge: 60 * 30, // 30 minutes for JWT expiration
  // },
  
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // console.log(auth?.user?.email)
      const isOnDashboard = nextUrl.pathname.startsWith(LandingPageRoutes.DASHBOARD);
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return NextResponse.redirect(new URL(LandingPageRoutes.DASHBOARD, nextUrl));
      }
      return true;
    },
   
    // async signIn({ account, profile }) {
    //   if (account.provider === "google") {
    //     return profile.email_verified && profile.email.endsWith("@example.com")
    //   }
    //   return true // Do different verification for other providers that don't have `email_verified`
    // },
  },
  providers: [ ], // Add providers with an empty array for now
} satisfies NextAuthConfig;
