import React from "react";

interface InputProps {
  type?: "text" | "select" | "date"; // Added "date" type
  value: string;
  onChange: (value: string) => void;
  options?: string[]; // For select dropdowns
  errorMsg: string;
}

export default function Input({ type = "text", value, onChange, options, errorMsg }: InputProps) {
  return (
    <>
      {type === "select" && options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded h-8 px-2"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "date" ? (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded h-8 px-2"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded h-8 px-2"
        />
      )}
    </>
  );
}
