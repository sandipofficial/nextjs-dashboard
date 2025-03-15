"use client";
import Input from "@/app/ui/auth/Input";
import { stepThreeFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/app/ui/auth/buttons";
import { SendOtpButton, VerifyOtpButton } from "@/app/ui/auth/signup/OtpButton";
import React from "react";

const initialState: FormErrors = {};

export default function StepThreeForm() {
  const [serverErrors, formAction] = React.useActionState(
    stepThreeFormAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="relative flex flex-col p-3 items-center bg-white shadow-xl rounded-md min-h-[480px] max-h-[480px]"
    >
      <div className="text-2xl font-semibold text-center text-primary pb-2 pt-1">
        Verification
      </div>
      <div className="bg-primary w-[32rem] my-3 h-[2px]"></div>

      <div className="grid grid-cols-2 w-[32rem] gap-x-6 gap-y-4 scroll-hidden pb-2">
        <div className="col-span-2 w-full">
          {/* <Input
          label="Country Code"
          id="phone_code"
          type="select"
          errorMsg={serverErrors?.mobileNumber}
          /> */}
          <Input
            label="Mobile Number"
            id="mobileNumber"
            type="number"
            errorMsg={serverErrors?.mobileNumber}
            placeholder="Enter Mobile Number"
          />
        </div>
        <div>
        <SendOtpButton />
      </div>
      </div>

      

      <div className="grid grid-cols-2 w-[32rem] gap-x-6 gap-y-4 scroll-hidden pb-2">
        <div className="col-span-2 w-full">
          <Input
            label="OTP"
            id="otp"
            type="number"
            errorMsg={serverErrors?.otp}
            placeholder="Enter OTP"
          />
        </div>
        <div>
        <VerifyOtpButton />
      </div>
      </div>

      

      <div className="absolute bottom-10">
        <SubmitButton text="Next" />
      </div>
    </form>
  );
}
