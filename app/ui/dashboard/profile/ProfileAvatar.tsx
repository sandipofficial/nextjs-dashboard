import { useState } from "react";
import { Pencil } from "lucide-react"; // Using lucide-react for the edit icon

export default function ProfileAvatar({ profile, onEdit }: { profile: any; onEdit: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative w-28 h-28 flex justify-center items-center text-3xl rounded-xl bg-white border-[5px] border-gray-300 overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onEdit} // Open upload popup when clicked
    >
      {profile?.profileUrl ? (
        <img src={profile.profileUrl} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <p>{profile?.initials}</p>
      )}

      {/* Gray overlay & edit icon on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center cursor-pointer">
          <Pencil size={30} className="text-white" />
        </div>
      )}
    </div>
  );
}
