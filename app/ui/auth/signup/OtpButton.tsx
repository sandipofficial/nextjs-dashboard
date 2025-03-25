"use client";

import { useState, useEffect } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "@/app/lib/firebaseConfig";
import { useAuthContext } from "@/contexts/AuthContext";
import { ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export function SendOtpButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otpSent, setOtpSent] = useState(false);
  const { updateNewSignUpData, newSignUpData } = useAuthContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMobileNumber = newSignUpData.mobileNumber;
      if (storedMobileNumber) {
        setMobileNumber(storedMobileNumber);
      }
    }
  }, [updateNewSignUpData,newSignUpData]);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA verified"),
        }
      );
    } else {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier.render();
    }
  }, []);
  

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");

    if (!mobileNumber || mobileNumber.length < 10) {
      setMessage("Invalid mobile number");
      setLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${mobileNumber}`,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setMessage("OTP Sent! Check your phone.");
      setOtpSent(true);
    } catch (error) {
      setMessage("Failed to send OTP. Try again.");
      console.error("Error sending OTP:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <button
        type="button"
        className={`bg-teal-500 h-[40px] w-[130px] rounded-full border-[3px] border-gray-400 text-white font-bold text-xs 
          ${
            loading || otpSent
              ? "bg-gray-400 cursor-not-allowed"
              : "hover:bg-teal-600"
          }
        `}
        onClick={handleSendOtp}
        disabled={loading || otpSent}
      >
        {loading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
      </button>
      <div id="recaptcha-container"></div>
      {/* {message && <p className="text-xs mt-1 text-green-500">{message}</p>} */}
    </div>
  );
}

interface VerifyOtpButtonProps {
  setVerified: (value: boolean) => void; // ✅ Properly typed function prop
}

export function VerifyOtpButton({ setVerified }: VerifyOtpButtonProps) {
  const [otp, setOtp] = useState<string>(""); // ✅ Explicit string type
  const [loading, setLoading] = useState<boolean>(false); // ✅ Explicit boolean type
  const [message, setMessage] = useState<string>(""); // ✅ Explicit string type
  const [otpVerified, setOtpVerified] = useState<boolean>(false); // ✅ Explicit boolean type
  const { updateNewSignUpData, newSignUpData } = useAuthContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOtp = newSignUpData?.otp;
      if (storedOtp) {
        setOtp(storedOtp);
      }
    }
  }, [updateNewSignUpData, newSignUpData]);

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    if (!otp || otp.length !== 6) {
      setMessage("Invalid OTP");
      setLoading(false);
      return;
    }

    try {
      const confirmationResult = (window as any)
        .confirmationResult as ConfirmationResult;
      const result = await confirmationResult.confirm(otp);

      if (result.user) {
        setMessage("OTP Verified Successfully!");
        setOtpVerified(true);
        setVerified(true); // ✅ Enable Submit Button
        
      }
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div>
        <button
          type="button"
          className={`ml-2 bg-blue-500 h-[40px] w-[130px] rounded-full border-[3px] border-gray-400 text-white font-bold text-xs 
            ${
              loading || otpVerified
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-blue-600"
            }
          `}
          onClick={handleVerifyOtp}
          disabled={loading || otpVerified }
        >
          {loading ? "Verifying..." : otpVerified ? "Verified" : "Verify OTP"}
        </button>
      </div>
      {/* {message && <p className="text-xs mt-1 text-green-500">{message}</p>} */}
    </div>
  );
}
