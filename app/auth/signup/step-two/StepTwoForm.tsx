"use client";
import Input from "@/app/ui/auth/Input";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types";
import SubmitButton from "@/app/ui/auth/buttons";
import React from "react";

const initialState: FormErrors = {};

export default function StepTwoForm() {
  const [serverErrors, formAction] = React.useActionState(
    stepOneFormAction,
    initialState
  );

  const nextStep = () => {};

  return (
    <form
      action={formAction}
      className=" flex flex-col p-3  items-center bg-white shadow-xl rounded-md min-h-[480px] max-h-[480px]"
    >
      <div className="text-2xl font-semibold text-center text-primary pb-2 pt-1">
        Address Details
      </div>
      <div className="bg-primary w-[32rem] my-3 h-[2px] "></div>
      <div className="grid grid-cols-2 w-[32rem] gap-x-6 gap-y-3 scroll-hidden pb-2">
        <Input
          label="Street"
          id="address_street"
          type="text"
          errorMsg={serverErrors?.address_street}
        />

        <Input
          label="Country"
          id="address_country"
          type="select"
          errorMsg={serverErrors?.address_country}
        />

        <Input
          label="State"
          id="address_state"
          type="select"
          errorMsg={serverErrors?.address_state}
        />

        <Input
          label="City"
          id="address_city"
          type="select"
          errorMsg={serverErrors?.address_city}
        />

        <Input
          label="Zip Code"
          id="address_zipCode"
          type="text"
          errorMsg={serverErrors?.address_zipCode}
        />
      </div>
      <div className="">
        <SubmitButton text="Next" />
      </div>
    </form>
  );
}
