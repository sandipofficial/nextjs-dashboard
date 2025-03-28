import { updateProfile } from "@/app/dashboard/profile/edit/action";
import { useProfile } from "@/contexts/ProfleContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "./Input";
import { Button } from "@/app/ui/button";
import { EditBasicDetailsSkeleton } from "@/app/ui/skeletons";

export default function BasicInfo() {
  const { profile, isLoading } = useProfile();
  const [Profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🟢 Load profile data
  useEffect(() => {
    if (profile) {
      setProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
      });
    }
  }, [profile]);

  const handleEdit = (field: keyof typeof Profile) => {
    setEditField(field);
    if (field === "dob") {
      setTempValue(
        Profile.dob ? new Date(Profile.dob).toLocaleDateString("en-CA") : ""
      );
    } else {
      setTempValue(Profile[field]);
    }
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue("");
  };

  console.log("tempValue ", tempValue);
  const handleSave = async () => {
    if (editField) {
      const response = await updateProfile(
        profile?.id ?? 0,
        editField,
        tempValue
      );
      if (response.success) {
        setProfile((prev) => ({ ...prev, [editField]: tempValue }));
        setEditField(null);
        toast.success(`${editField} updated successfully!`); // 🟢 Success toast
      } else {
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : response.error?._errors?.join(", ") ||
              "An unknown error occurred";
        setErrorMsg(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <EditBasicDetailsSkeleton />
      ) : (
        <div className="bg-white rounded-md w-[75%] p-5 mx-auto shadow-md absolute top-40 mb-5 left-70">
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
                    <Input
                      type={
                        field === "gender"
                          ? "select"
                          : field === "dob"
                          ? "date"
                          : "text"
                      }
                      value={tempValue}
                      onChange={setTempValue}
                      options={
                        field === "gender"
                          ? ["Male", "Female", "Other"]
                          : undefined
                      }
                      errorMsg={errorMsg}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="bg-blue-400 h-8 text-gray-900 hover:text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="bg-gray-100 h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span>
                    {field === "dob" && value
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(value))
                      : value || "N/A"}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {editField !== field && (
                  <Button
                    onClick={() => handleEdit(field as keyof typeof Profile)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
