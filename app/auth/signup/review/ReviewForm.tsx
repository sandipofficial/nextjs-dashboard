"use client";
import Input from "@/app/ui/auth/signup/Input";
import SubmitButton from "@/app/ui/auth/buttons";
import { submitReviewAction } from "./actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { NewSignUpType } from "@/schemas";
import React, { useState } from "react";

export default function ReviewForm() {
  const router = useRouter();
  const { newSignUpData, resetAuthStorage } = useAuthContext();
  const [err, setErr] = React.useState<string | undefined>(undefined);


  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    mobileNumber,
    address_street,
    address_country,
    address_city,
    address_state,
    address_zipCode,
  } = newSignUpData;

  const handleFormSubmit = async (formData: FormData) => {
    const res = await submitReviewAction(newSignUpData as NewSignUpType);
    const { redirect, errorMsg, success } = res;

    if (success) {
      toast.success("Details submitted successfully");
      resetAuthStorage();
    } else if (errorMsg) {
      setErr(errorMsg)
      toast.error(errorMsg);
    }
    if (redirect) {
      resetAuthStorage();
      setTimeout(() => {
        router.push(redirect);
      }, 3000);
    }
    
  };

  return (
    <form
      action={handleFormSubmit}
      className="flex flex-1 flex-col p-8 gap-2 items-stretch lg:max-w-[700px] bg-white shadow-xl rounded-md min-h-[480px] max-h-[480px]"
    >
      <p className="text-xl md:text-3xl">
        Name: {firstName} {lastName}
      </p>
      <p className="font-light ">Email ID: {email}</p>
      <p className="">Gender: {gender}</p>
      <p className="">Date of Birth: {dateOfBirth}</p>
      <p className="">Mobile Number: {mobileNumber}</p>
      <p className="">
        Address: {address_street}, {address_city}, {address_state},{" "}
        {address_country}, {address_zipCode}
      </p>
      <SubmitButton text="Submit" verified={true} />
      <div>{err}</div>
    </form>
  );
}
