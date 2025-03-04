"use client";

import { useState } from "react";
import Image from "next/image";
import StepOne from "./signup/StepOne";
import StepTwo from "./signup/StepTwo";
import StepThree from "./signup/StepThree";

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
    <div className="flex pt-8 min-h-[80vh] w-[60vw] mx-auto justify-center bg-transparent rounded-lg shadow-xl border border-primary p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
          <StepOne formData={formData} handleChange={handleChange} nextStep={nextStep} />
        )}
        {step === 2 && (
          <StepTwo formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />
        )}
        {step === 3 && (
          <StepThree formData={formData} handleFileChange={handleFileChange} prevStep={prevStep} />
        )}
      </div>
    </div>
  );
}






