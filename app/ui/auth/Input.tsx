"use client";
import { useEffect, useState } from "react";
import { useSignupContext } from "@/contexts/SignupContext";
import { RedStar } from "./buttons";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Country, State, City } from "country-state-city";

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
  errorMsg ,
}: InputProps) {
  const { updateNewDealDetails, newSignUpData } = useSignupContext();
  const [showPassword, setShowPassword] = useState(false);

  // Track selected country and state with local storage
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [phoneCode, setPhoneCode] = useState<string>("+91"); // Default to India

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountry = localStorage.getItem("address_country");
      const storedState = localStorage.getItem("address_state");

      if (storedCountry) setSelectedCountry(storedCountry);
      if (storedState) setSelectedState(storedState);
    }
  }, [updateNewDealDetails]);

  // Handle input changes and store them in localStorage
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    

    console.log(errorMsg)

    updateNewDealDetails({ [name]: value });

    if (typeof window !== "undefined") {
      localStorage.setItem(name, value);
    }

    if (name === "address_country") {
      setSelectedCountry(value);
      setSelectedState(""); // Reset state when country changes
      localStorage.removeItem("address_state"); // Clear state in storage
    }

    if (name === "address_state") {
      setSelectedState(value);
    }

    if (name === "phone_code") {
      setPhoneCode(value);
    }
  };

  // Fetch all countries for phone codes
  const countries = Country.getAllCountries();
  const phoneCodes = countries.map((country) => ({
    code: country.isoCode,
    dialCode: `+${country.phonecode}`,
    name: country.name,
  }));
  
  // Fetch states based on selected country
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  // Fetch cities based on selected state
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];
  
  // Mapping for select options
  const selectOptions: Record<string, { value: string; text: string }[]> = {
    gender: [
      { value: "", text: "Select Gender" },
      { value: "Male", text: "Male" },
      { value: "Female", text: "Female" },
      { value: "Other", text: "Other" },
    ],
    address_country: [
      { value: "", text: "Select Country" },
      ...countries.map((country) => ({
        value: country.isoCode,
        text: country.name,
      })),
    ],
    address_state: [
      { value: "", text: "Select State" },
      ...states.map((state) => ({
        value: state.isoCode,
        text: state.name,
      })),
    ],
    address_city: [
      { value: "", text: "Select City" },
      ...cities.map((city) => ({
        value: city.name,
        text: city.name,
      })),
    ],
    countryCode: [
      { value: "", text: "Select Code" },
      ...phoneCodes.map((code) => ({
        value: code.dialCode, // Correctly map the value to the dial code
        text: `${code.dialCode} (${code.name})`, // Show dial code and country name
        // Combine dialCode and isoCode to create a unique key
        key: `${code.dialCode}-${code.code}`,
      })),
    ],
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

      {/* Select Field */}
      {type === "select" && selectOptions[id] ? (
        <div className="relative" title={errorMsg}>
          <select
            id={id}
            name={id}
            className={`w-full h-10 rounded-md border-2 text-sm text-slate-900 pr-4 ${
              errorMsg
                ? "border-red-500"
                : "border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
            }`}
            onChange={handleInputChange}
            value={newSignUpData?.[id as keyof typeof newSignUpData] ?? ""}
          >
            {selectOptions[id].map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="relative" title={errorMsg}>
          <input
            className={`w-full h-10 rounded-md border-2 text-slate-900 pr-4 placeholder:text-xs ${
              errorMsg
                ? "border-red-500 placeholder:text-red-500 "
                : "border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
            }`}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            name={id}
            id={id}
            required={required}
            pattern={pattern}
            placeholder={errorMsg ? errorMsg : placeholder}
            minLength={minLength}
            min={min}
            max={max}
            onChange={handleInputChange}
            defaultValue={
              newSignUpData?.[id as keyof typeof newSignUpData] ?? ""
            }
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
      )}
    </div>
  );
}
