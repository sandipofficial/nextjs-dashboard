import React, { Suspense } from "react";
import StepNavigation from "@/app/ui/auth/signup/StepsProgress";
import { lusitana } from "@/app/ui/fonts";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Link } from "lucide-react";
import { LandingPageRoutes } from "@/types";

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      {/* <PageHeader
        title="Share a Deal"
        subtitle="Have an amazing deal or discount tailored for developers? Let us know!"
      /> */}

      <div className="relative w-screen h-screen justify-center items-center gap-x-10 ml-18 relative items-center  flex ">
        <StepNavigation />
        <div className="w-[620px]">{children}</div>
      </div>
    </div>
  );
}
