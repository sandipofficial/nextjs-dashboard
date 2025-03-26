"use client";
import { EditPageProfileSkeleton } from "@/app/ui/skeletons";
import { useProfile } from "@/contexts/ProfleContext";
import { DashboardRoutes } from "@/types";
import Link from "next/link";
import { BsBoxArrowUpRight } from "react-icons/bs";

export default function HeroProfile(){
    const { profile, isLoading, isError } = useProfile();
    return(
        <div className="relative w-full h-60 bg-teal-900">
        <div className="absolute top-10 left-16 flex ">
          {isLoading ? (
            <EditPageProfileSkeleton />
          ) : (
            <div className="flex items-center gap-20">
              <div className=" w-20 h-20 flex justify-center items-center text-3xl rounded-xl bg-white border-[5px] border-red-500">
                {profile?.initials}
              </div>
              <div className="text-white">
                <div className="flex gap-3">
                  <div className="text-2xl">{profile?.fullName}</div>
                  <Link href={DashboardRoutes.PROFILE}>
                    <BsBoxArrowUpRight className="text-blue-500" />
                  </Link>
                </div>
                <div className="text-sm">Email Id: {profile?.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
}