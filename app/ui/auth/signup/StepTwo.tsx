// Step 2: PAN & OTP Verification
export default function StepTwo({ formData, handleChange, nextStep, prevStep }: any) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center">Verification</h2>
      <input type="text" name="panNumber" placeholder="PAN Number" value={formData.panNumber} onChange={handleChange} className="input-field" />
      <button className="btn-secondary">Send OTP</button>
      <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} className="input-field" />
      <div className="flex justify-between">
        <button onClick={prevStep} className="btn-secondary">Back</button>
        <button onClick={nextStep} className="btn-primary">Next</button>
      </div>
    </div>
  );
}