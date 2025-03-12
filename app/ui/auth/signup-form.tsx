"use client";

import { useState } from "react";
import Image from "next/image";
import MultiStepForm from "./signup/MultiStepPage";
import StepsProgress from "./signup/StepsProgress";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    panNumber: "",
    otp: "",
    profileImage: null as File | null,
  });

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  // Move to Next Step
  const nextStep = () => setStep((prev) => prev + 1);
  // Move to Previous Step
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex pt-8 min-h-[80vh] w-[65vw] mx-auto justify-center bg-background rounded-lg shadow-2xl border border-primary p-4">
      <div className="w-full  flex justify-between items-center">
        <StepsProgress/>
        <MultiStepForm />
      </div>
    </div>
  );
}






