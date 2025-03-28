"use client";
import { useProfile } from "@/contexts/ProfleContext";
import { IoLocation } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { FaMobileRetro } from "react-icons/fa6";
import { BiMaleFemale } from "react-icons/bi";
import {
  ProfileDetailsSkeleton,
  ProfileGridSkeleton,
  ProfileSkeleton,
} from "@/app/ui/skeletons";
import Link from "next/link";
import { DashboardRoutes } from "@/types";

export default function Page() {
  const { profile, isLoading, isError } = useProfile();

  const profileDetails = [
    { icon: <IoLocation />, label: "Location", value: profile?.country },
    {
      icon: <MdOutlineDateRange />,
      label: "Date of Birth",
      value: profile?.dob,
    },
    { icon: <FaMobileRetro />, label: "Mobile", value: profile?.mobileNumber },
    { icon: <BiMaleFemale />, label: "Gender", value: profile?.gender },
  ];

  return (
    <div className="w-full flex gap-3 overflow-hidden">
      <div className=" border border-black p-2 rounded w-[30%] h-[78vh] scroll-auto ">
        {/* profile */}
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white flex justify-center items-center border border-red-500 rounded-md">
              {profile?.initials}
            </div>
            <div>
              <div className="text-md">
                {profile?.firstName} {profile?.lastName}
              </div>
              <div className="text-sm">{profile?.email}</div>
            </div>
          </div>
        )}

        <Link
          href={DashboardRoutes.EDIT_PROFILE}
          className="my-3 py-1 rounded bg-teal-500 flex justify-center items-center text-black  text-sm  hover:bg-teal-600 transition"
        >
          {isLoading ? "Loading..." : "Edit Profile"}
        </Link>

        {/* details */}
        <div>
          {isLoading ? (
            <ProfileDetailsSkeleton />
          ) : (
            profileDetails.map((detail, index) => (
              <div key={index} className="flex items-center gap-1">
                <span>{detail.icon}</span>
                <div>{detail.value || "N/A"}</div> {/* Handle missing values */}
              </div>
            ))
          )}
        </div>

        <div className="h-[1px] mt-2 w-full bg-teal-500"></div>
      </div>
      {!isLoading ? (
        <ProfileGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 p-1 w-full ">
          <div className="w-[30vw]"></div>
          <div className="w-[30vw]"></div>
          <div className="w-[30vw]"></div>
          <div className="w-[30vw]"></div>
        </div>
      )}
    </div>
  );
}
