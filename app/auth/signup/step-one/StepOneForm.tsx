"use client";
import Input from "@/app/ui/auth/Input";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/app/ui/auth/buttons";
import React from "react";

const initialState: FormErrors = {};

export default function StepOneForm() {
  const [serverErrors, formAction] = React.useActionState(
    stepOneFormAction,
    initialState
  );

  const nextStep = () => {};

  return (
    <form action={formAction} className="relative flex flex-col p-3 min-h-[80vh] items-center bg-white shadow-xl rounded-md">
      <div className="text-2xl font-semibold text-center text-primary pb-2 pt-1">
        Basic Details
      </div>
      <div className="bg-primary w-[32rem] my-3 h-[2px] "></div>
      <div className="grid grid-cols-2 w-[32rem] gap-x-6 gap-y-4 scroll-hidden pb-2">
        <Input
          label="First Name"
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          errorMsg={serverErrors?.firstName}
        />

        <Input
          label="Last Name"
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          errorMsg={serverErrors?.lastName}
        />

        <Input
          label="Email Id"
          id="email"
          type="email"
          placeholder="Enter your email"
          errorMsg={serverErrors?.email}
        />

        <Input
          label="Gender"
          id="gender"
          type="select"
          placeholder="Select your gender"
          errorMsg={serverErrors?.gender}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          errorMsg={serverErrors?.password}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          errorMsg={serverErrors?.confirmPassword}
        />

        <Input
          label="Date of Birth"
          id="dateOfBirth"
          type="date"
          placeholder="Select your date of birth"
          errorMsg={serverErrors?.dateOfBirth}
        />

        <Input
          label="Mobile Number"
          id="mobileNumber"
          type="text"
          placeholder="Enter your mobile number"
          errorMsg={serverErrors?.mobileNumber}
        />
      </div>
      <div className="absolute bottom-10">
        <SubmitButton text="Next" />
      </div>
    </form>
  );
}
