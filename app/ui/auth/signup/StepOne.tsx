import { NextButton } from "../buttons";

// Step 1: Basic Details
export default function StepOne({ formData, handleChange, nextStep }: any) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold text-center text-primary scroll-auto pb-6">
        Basic Details
      </h2>
      <div className="grid grid-cols-2 gap-4 pb-4">
        <div className="flex flex-col">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-accent"
          >
            First Name <span className="text-red-500">*</span>
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
            className="text-sm font-medium text-accent"
          >
            Last Name
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
          <label htmlFor="email" className="text-sm font-medium text-accent">
            Email ID
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
          <label htmlFor="gender" className="text-sm font-medium text-accent">
            Gender
          </label>
          <select id="gender" name="gender" className="input-field">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-sm font-medium text-accent"
          >
            Password
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
            className="text-sm font-medium text-accent"
          >
            Confirm Password
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
            className="text-sm font-medium text-accent"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="date"
            className="input-field"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="mobileNumber"
            className="text-sm font-medium text-accent"
          >
            Mobile Number
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
      </div>

      <NextButton nextStep={nextStep} />
    </div>
  );
}
