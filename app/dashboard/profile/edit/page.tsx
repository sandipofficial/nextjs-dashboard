"use client";

import { useEffect, useState } from "react";
// import { updateProfile } from "@/app/actions"; // Import server action
import { Button } from "@/app/ui/button"; // Ensure you have a Button component
import { useProfile } from "@/contexts/ProfleContext";
import { updateProfile } from "./action";



export default function Page() {
    const { profile, isLoading, isError } = useProfile();
  
    const [Profile, setProfile] = useState({
      fullName: "",
      gender: "",
      location: "",
      birthday: "",
    });
  
    const [editField, setEditField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState("");
  
    // 🟢 Update profile state when data is loaded
    useEffect(() => {
      if (profile) {
        setProfile({
          fullName: profile.fullName || "",
          gender: profile.gender || "",
          location: profile.country || "",
          birthday: profile.dob || "",
        });
      }
    }, [profile]);

  const handleEdit = (field: keyof typeof profile) => {
    setEditField(field);
    setTempValue(Profile[field]);
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue("");
  };
const id = 1;
  const handleSave = async () => {
    if (editField && id) {
      const response = await updateProfile(id, editField, tempValue);
      if (response.success) {
        setProfile((prev) => ({ ...prev, [editField]: tempValue }));
        setEditField(null);
      } else {
        alert(response.error);
      }
    }
  };

  return (
    <div className="bg-white rounded-md w-[75%] p-5 mx-auto mt-20 shadow-md absolute top-20 left-70">
      <h2 className="text-lg font-bold mb-4">Basic Info</h2>
      {Object.entries(Profile).map(([field, value]) => (
        <div
          key={field}
          className="flex justify-between items-center py-2 border-b"
        >
          <div className="flex gap-3">
            <div className="font-medium capitalize h-10">{field}:</div>
            {editField === field ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="borde rounded h-8"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="bg-blue-400 h-8 text-gray-900 hover:text-white"
                  >
                    Save
                  </Button>
                  <Button onClick={handleCancel} className="bg-gray-100 h-8">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <span className="p-">{value}</span>
            )}
          </div>

          <div className="flex gap-2">
            {editField !== field && (
              <Button
                onClick={() => handleEdit(field as keyof typeof profile)}
                className=""
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
