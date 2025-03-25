"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { RedStar } from "../buttons";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  id: string;
  description?: string;
  required?: boolean;
  pattern?: string;
  type: string;
  minLength?: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  placeholder?: string;
}

export default function Input({
  label,
  id,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  placeholder,
  errorMsg,
}: InputProps) {
  const { updateLoginData, loginData } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes and store them in localStorage
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    console.log(errorMsg);

    updateLoginData({ [name]: value });

    if (typeof window !== "undefined") {
      localStorage.setItem(name, value);
    }
  };

  return (
    <div>
      {/* Label Section */}
      <label className="block text-black text-sm text-slate-500" htmlFor={id}>
        {label} {required ? <RedStar /> : ""}
        {description && (
          <span className="text-sm text-slate-400 block">{description}</span>
        )}
      </label>

      <div className="relative" title={errorMsg}>
        <input
          className={`w-full h-10 rounded-md border-2 text-slate-900 pr-4 placeholder:text-xs ${
            errorMsg
              ? "border-red-500 placeholder:text-red-500 "
              : "border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          }`}
        
          name={id}
          id={id}
          required={required}
          pattern={pattern}
          placeholder={errorMsg ? errorMsg : placeholder}
          minLength={minLength}
          min={min}
          max={max}
          onChange={handleInputChange}
          defaultValue={loginData?.[id as keyof typeof loginData] ?? ""}
        />
        {type === "password" && !errorMsg && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
