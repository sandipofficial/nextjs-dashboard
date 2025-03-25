"use client";

import { lusitana } from "@/app/ui/fonts";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Input from "@/app/ui/auth/signup/Input";
import { FormErrors, LandingPageRoutes } from "@/types";
import SubmitButton from "@/app/ui/auth/buttons";
import Link from "next/link";
import { resetPasswordAction } from "./action";
import { error } from "console";

const initialState: FormErrors = {};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
console.log(token)
console.log(email)
  const [serverErrors, formAction] = React.useActionState(
    async (prevState: FormErrors | undefined, formData: FormData) => {
      const errors = await resetPasswordAction(prevState, formData);
      console.log(errors)
      if (errors) {
        router.push(LandingPageRoutes.LOGIN); // Redirect after successful reset
      }
      return errors;
    },
    initialState
  );

  return (
    <form
      action={formAction}
      className="flex justify-center h-[30rem] bg-white shadow-md rounded-lg w-[85%]"
    >
      <div className="flex flex-col rounded-lg items-center w-full space-y-3 px-6 pb-4 pt-8">
        <div className={`${lusitana.className} text-2xl flex flex-col items-center`}>
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <h2 className="font-medium">Enter your new password below.</h2>
        </div>

        <div className="w-[90%] space-y-3">
          <Input label="New Password" id="password" type="password" placeholder="Enter new password" required errorMsg={serverErrors?.password} />
          <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm new password" required errorMsg={serverErrors?.confirmPassword} />
        </div>

        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />

        <SubmitButton text="Reset Password" verified={true} />

        <div className="text-[0.8rem]">
          Remembered your password? <Link className="hover:text-teal-500" href="/login">Login</Link>
        </div>
      </div>
    </form>
  );
}
