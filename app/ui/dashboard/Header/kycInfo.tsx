import { useProfile } from "@/contexts/ProfleContext";
import { DashboardRoutes } from "@/types";
import Link from "next/link";

export default function KycInfo() {
  const { profile, isLoading, isError } = useProfile();

  return (
    <div className=" border p-1 pl-2 rounded-lg min-w-24">
      <Link href={DashboardRoutes.KYC}>
        <div className="text-sm">KYC Status </div>
        <div className="flex gap-1 items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              profile?.kycStatus === "Pending"
                ? "bg-yellow-500"
                : profile?.kycStatus === "Verified"
                ? "bg-green-400"
                : profile?.kycStatus === "Rejected"
                ? "bg-red-500"
                : "bg-white-500"
            }`}
          ></div>
          <div className="text-sm">{profile?.kycStatus}</div>{" "}
        </div>
      </Link>
    </div>
  );
}
