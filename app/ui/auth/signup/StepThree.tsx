import Image from "next/image";

// Step 3: Profile Image Upload
export default function StepThree({ formData, handleFileChange, prevStep }: any) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center">Upload Profile Picture</h2>
        <input type="file" onChange={handleFileChange} className="file-input" />
        {formData.profileImage && (
          <Image src={URL.createObjectURL(formData.profileImage)} alt="Profile Preview" width={100} height={100} className="rounded-full mx-auto" />
        )}
        <div className="flex justify-between">
          <button onClick={prevStep} className="btn-secondary">Back</button>
          <button className="btn-primary">Submit</button>
        </div>
      </div>
    );
  }