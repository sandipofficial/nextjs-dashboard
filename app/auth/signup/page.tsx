import AcmeLogo from "@/app/ui/acme-logo";
import Header from "@/app/ui/auth/header";
import SignupForm from "@/app/ui/auth/signup-form";
import { SignupRoutes } from "@/types";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function SignupPage() {
  // return (
    // <main className="flex  bg-background justify-center md:h-[100vh] p-4">
    //   <div className=" flex w-full  flex-col space-y-2.5 ">
    //     <Header />
    //     <Suspense>
    //       <SignupForm />
    //     </Suspense>
    //   </div>
    // </main>
    redirect(SignupRoutes.BASIC_DETAILS);
  // );
}
