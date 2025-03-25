import { AuthContextProvider } from "@/contexts/AuthContext";
import { LandingPageRoutes } from "@/types";
import Link from "next/link";
import React from "react";
import { lusitana } from "../ui/fonts";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <Link
        href={LandingPageRoutes.HOMEPAGE}
        className={`${lusitana.className} absolute top-3 left-4 flex flex-row gap-1 items-center cursor-pointer text-primary`}
      >
        <GlobeAltIcon className="h-10 w-10 rotate-[15deg]" />
        <p className="text-[32px]">Finance</p>
      </Link>

      {children}
    </AuthContextProvider>
  );
}
