import { useState } from "react";
import {
  NextButton,
  PrevButton,
  RedStar,
  SendOtpButton,
  SubmitButton,
} from "../buttons";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import CountdownTimer from "../CountDownTimer";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleStepChange = useDebouncedCallback((term: number) => {
    const params = new URLSearchParams(searchParams);
  
    if (term) {
      params.set('step', term.toString()); // Convert number to string
    } else {
      params.delete('query');
    }
  
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  


  //functions to control steps
  const prevStep = () => {
    setStep((prev) => {
      const newStep = prev - 1;
      handleStepChange(newStep);
      return newStep;
    });
  };

  const nextStep = () => {
    setStep((prev) => {
      const newStep = prev + 1;
      handleStepChange(newStep);
      return newStep;
    });
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
    date: "",
    mobileNumber: "",
    panNumber: "",
    contact: "",
    otp: "",
    profileImage: null,
  });

  const [useEmail, setUseEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //     setFormData({ ...formData, profileImage: e.target.value });
  //   };

  const handleSendOtp = () => {
    if (formData.contact.trim() === "") return;
    nextStep();
  };

  const handleSubmit = () => {
    setStep(4);
  };

  // Animation Variants for Page Transition
  const pageVariants = {
    initial: { opacity: 0, x: 50 }, // Start from the right
    animate: { opacity: 1, x: 0 }, // Move to the center
    exit: { opacity: 0, x: -50 }, // Exit to the left
  };

  return (
    <div className="flex flex-col  w-[100%] mx-auto space-y-4">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-center text-primary">
            Basic Details
          </h2>
          <div className="grid grid-cols-2 gap-3 pb-4 h-72 w-[28rem] mx-auto  scroll-hidden">
            <div className="flex flex-col">
              <label
                htmlFor="firstName"
                className="text-[13px] font-medium text-accent"
              >
                First Name <RedStar />
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="lastName"
                className="text-[13px] font-medium text-accent"
              >
                Last Name <RedStar />
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-[13px] font-medium text-accent"
              >
                Email ID <RedStar />
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="gender"
                className="text-[13px] font-medium text-accent"
              >
                Gender <RedStar />
              </label>
              <select id="gender" name="gender" className="input-field text-sm">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-accent"
              >
                Password <RedStar />
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="confirmPassword"
                className="text-[13px] font-medium text-accent"
              >
                Confirm Password <RedStar />
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="dateOfBirth"
                className="text-[13px] font-medium text-accent"
              >
                Date of Birth <RedStar />
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="date"
                className="input-field text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="mobileNumber"
                className="text-[13px] font-medium text-accent"
              >
                Mobile Number <RedStar />
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            {/* <div>
            <label
                htmlFor="mobileNumber"
                className="text-[13px] font-medium text-accent"
              >
                Address <RedStar/>
              </label>
            </div> */}
          </div>

          <NextButton nextStep={() => nextStep()} />
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex w-full">
            <div className="flex flex-start">
              <PrevButton prevStep={() => prevStep()} />
            </div>
            <h2 className="flex justify-center w-full text-2xl font-semibold text-center text-primary">
              Verification
            </h2>
          </div>

          <div className="flex flex-col justify-center space-y-3 pb-4">
            <div className="flex w-full items-center border border-primary rounded-lg">
              <button
                className={`w-1/2 text-center py-2 ${
                  useEmail ? "bg-primary text-white" : "text-gray-700"
                }`}
                onClick={() => setUseEmail(true)}
              >
                Email
              </button>

              <button
                className={`w-1/2 text-center py-2 ${
                  !useEmail ? "bg-primary text-white" : "text-gray-700"
                }`}
                onClick={() => setUseEmail(false)}
              >
                Mobile
              </button>
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="text-[13px] font-medium text-accent"
              >
                {!useEmail ? "Mobile Number" : "Email Id"} <RedStar />
              </label>
              <input
                type={useEmail ? "email" : "tel"}
                name="contact"
                placeholder={useEmail ? "Enter Email" : "Enter Mobile Number"}
                value={formData.contact}
                onChange={handleChange}
                className="input-field border rounded-md p-2"
              />
            </div>

            <SendOtpButton handleSendOtp={handleSendOtp} />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex flex-col space-y-4">
            <div className="flex  w-full">
              <div className="flex flex-start">
                <PrevButton prevStep={() => prevStep} />
              </div>
            </div>

            <h2 className="flex justify-center w-full text-2xl font-semibold text-center text-primary">
              Enter OTP
            </h2>
            <div className="w-full flex justify-center">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="text-primary" />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <CountdownTimer />
            <SubmitButton handleSubmit={handleSubmit} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="flex flex-col space-y-4 w-full items-center">
            <h2 className="text-2xl font-semibold text-center">
              Upload Profile Picture
            </h2>
            <div>
              <div className="flex flex-col items-center w-full space-y-4">
                <label htmlFor="" title="Upload the profile picture">
                  Upload the profile picture
                </label>
                <input type="file" className="pl-28" />
              </div>
            </div>
            {formData.profileImage && (
              <Image
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile Preview"
                width={100}
                height={100}
                className="rounded-full mx-auto"
              />
            )}
            <div className="flex justify-between">
              <SubmitButton handleSubmit={handleSubmit} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
