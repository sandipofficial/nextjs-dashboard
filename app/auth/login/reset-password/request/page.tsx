"use client";

import React from "react";
import Input from "@/app/ui/auth/signup/Input";
import SubmitButton from "@/app/ui/auth/buttons";
import { requestPasswordResetAction } from "./action";
import { FormErrors } from "@/types";
import { toast } from "react-hot-toast";

const initialState: FormErrors = {};

export default function RequestPasswordResetForm() {
  const [serverErrors, formAction] = React.useActionState(
    async (prevState: FormErrors | undefined, formData: FormData) => {
      const errors = await requestPasswordResetAction(prevState, formData);
      if (!errors) {
        toast.success("Password reset link sent! Check your email.");
      }
      return errors;
    },
    initialState
  );

  return (
    <form action={formAction} className="flex justify-center h-[30rem] bg-white shadow-md rounded-lg w-[85%]">
      <div className="flex flex-col rounded-lg items-center w-full space-y-3 px-6 pb-4 pt-8">
        <h1 className="text-2xl font-semibold">Forgot Password?</h1>

        <div className="w-[90%] space-y-3">
          <Input 
            label="Email" 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
            errorMsg={serverErrors?.email} // Show error if exists
          />
        </div>

        <SubmitButton text="Send Reset Link" verified={true} />
      </div>
    </form>
  );
}
