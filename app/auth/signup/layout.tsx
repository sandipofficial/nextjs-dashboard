import React, { Suspense } from "react";
import StepNavigation from "@/app/ui/auth/signup/StepsProgress";
import { SignupContextProvider } from "@/contexts/SignupContext";
import DashboardSkeleton from "@/app/ui/skeletons";

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

      <div className="w-screen h-screen justify-center items-center gap-x-10 ml-18 relative items-center  flex ">
        <StepNavigation />
        <Suspense fallback={<DashboardSkeleton/>}>
          <SignupContextProvider>
            <div className="w-[620px]">{children}</div>
          </SignupContextProvider>
        </Suspense>
      </div>
    </div>
  );
}
