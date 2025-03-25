import AcmeLogo from "@/app/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { lusitana } from "./ui/fonts";
import Image from "next/image";
import Header from "./ui/auth/header";
import { LandingPageRoutes } from "@/types";

export default function Page() {
  return (
    <main className=" bg-background flex min-h-screen flex-col p-4">
      <Header/>
      <div className="relative w-full h-[90vh] flex items-center justify-center group overflow-hidden">
        {/* Background Image */}
        {/* <Image
          src="/hero-desktop.png"
          width={650}
          height={160}
          className="absolute z-0 mx-auto"
          alt="Finance Dashboard Background"
        /> */}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_50%)] pointer-events-none"
            style={{ width: "100vw", height: "100vh" }}
          />
        </div>

        {/* Foreground Content */}
        <div className="relative h-[90vh] z-10 flex flex-col items-center text-center bg-background/30 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-lg">
          <p
            className={`w-[90vw] text-xl text-gray-900 md:text-3xl md:leading-normal pt-14 text-accent ${lusitana.className}`}
          >
            <strong>Welcome to Acme.</strong> <br /> This is the example for the{" "}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Project
            </a>{" "}
            <br />, based on the finance dashboard.
          </p>
          <div className="flex gap-3 mt-6">
            <Link
              href= {LandingPageRoutes.LOGIN}
              className="flex items-center gap-5 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Log in</span>
            </Link>
            <Link
              href={LandingPageRoutes.SIGN_UP}
              className="flex items-center gap-5 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
