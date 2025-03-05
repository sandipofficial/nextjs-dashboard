import { ArrowLeftCircleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function Signup() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Sign Up</span>{" "}
    </Link>
  );
}

export function Login() {
  return (
    <Link
      href="/auth/login"
      className="bg-accent text-background w-[6rem] flex justify-center py-1 cursor-pointer hover:bg-primary hover:border hover:rounded-md "
    >
      <span>Log in</span>
    </Link>
  );
}

export type NextButtonProps = {
  nextStep: () => void; // Function that doesn't return anything
};

export type PrevButtonProps = {
  prevStep: () => void
};

export type OtpButtonProps = {
  handleSendOtp: () => void
}

export type SubmitButtonProps = {
  handleSubmit: () => void
}

export function NextButton({ nextStep }: NextButtonProps) {
  return (
    <div>
      <button onClick={nextStep} className="bg-accent mx-auto text-background w-[10rem] flex justify-center py-1 cursor-pointer hover:bg-primary hover:text-white rounded-md">
        Next
      </button>
    </div>
  );
}

export function PrevButton({ prevStep }: PrevButtonProps) {
  return (
    <div>
      <button onClick={prevStep} className="text-accent mx-auto  flex justify-center py-1 cursor-pointer hover:text-primary  rounded-md">
        <ArrowLeftCircleIcon width={30}/>
      </button>
    </div>
  );
}

export function SendOtpButton({handleSendOtp}: OtpButtonProps) {
  return (
    <div>
      <button onClick={handleSendOtp} className="bg-accent mx-auto text-background w-[10rem] flex justify-center py-1 cursor-pointer hover:bg-primary hover:text-white rounded-md">
        Send OTP
      </button>
    </div>
  );
}


export function SubmitButton({handleSubmit}: SubmitButtonProps) {
  return (
    <div>
      <button onClick={handleSubmit} className="bg-success mx-auto text-background w-[10rem] flex justify-center py-1 cursor-pointer  hover:text-white rounded-md">
        Submit
      </button>
    </div>
  );
}

export function RedStar() {
  return (
        <span className="text-danger">*</span>
  );
}


