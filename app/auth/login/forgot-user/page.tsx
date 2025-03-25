"use client";

import SubmitButton from "@/app/ui/auth/buttons";
import Input from "@/app/ui/auth/signup/Input";
import { SendOtpButton, VerifyOtpButton } from "@/app/ui/auth/signup/OtpButton";
import { FormErrors, LandingPageRoutes } from "@/types";
import React, { useState, useTransition } from "react";
import { sendOtpAction } from "./action";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const initialState: FormErrors = {};

export default function ForgetUser() {
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
const router = useRouter()
  const [serverErrors, formAction] = React.useActionState(
    async (prevState: FormErrors | undefined, formData: FormData) => {
      const response = await sendOtpAction(prevState, formData);
      console.log(response);
      if ("email" in response) {
        localStorage.setItem("email",response.email.toString().trim())
        setUserEmail(response.email); // Store email if OTP request is successful
        // toast.success(`OTP sent successfully! User email: ${response.email}`);
        setTimeout(() => {
            router.push(LandingPageRoutes.LOGIN); // Redirect after 4s
          }, 4000);
        return undefined;
      } else {
        // toast.error(response.message || "Failed to send OTP.");
        return response;
      }
    },
    initialState
  );

  console.log("userEmail ", userEmail);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [verified, setVerified] = useState(false);

  console.log(serverErrors);
  return (
    <form
      action={formAction}
      className=" relative flex justify-center h-[30rem] bg-white shadow-md rounded-lg w-[85%]"
    >
      <div className="flex flex-col rounded-lg items-center  w-full space-y-3 px-6 pb-4 pt-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Forget User</h2>

        
          <div className="space-y-4 flex flex-col items-center">
            <Input
              label="Mobile Number"
              id="mobileNumber"
              type="number"
              errorMsg={serverErrors?.mobileNumber}
              placeholder="Enter Mobile Number"
              required
            />
            <SendOtpButton  />
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <Input
              label="OTP"
              id="otp"
              type="number"
              errorMsg={serverErrors?.otp}
              placeholder="Enter OTP"
            />

            <VerifyOtpButton setVerified={setVerified} />
          </div>
        
        
        <div className="absolute bottom-6">
          <SubmitButton text="Submit" verified={verified} />
        </div>

        {userEmail && (
          <p className="mt-4 text-sm text-gray-700">
            Your registered email:{" "}
            <span className="font-semibold">{userEmail}</span>
          </p>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </form>
  );
}
