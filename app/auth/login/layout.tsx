import React, { Suspense } from "react";
import StepNavigation from "@/app/ui/auth/signup/StepsProgress";
import AcmeLogo from "@/app/ui/acme-logo";
import { lusitana } from "@/app/ui/fonts";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

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

      <div className="relative w-screen  h-screen justify-center items-center gap-x-10 ml-18 relative  flex ">
        <div className="w-[490px]">{children}</div>
      </div>
    </div>
  );
}
