"use client";
import Icon from "../Icon";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import { useEffect, useState } from "react";
import { LandingPageRoutes, SignupRoutes } from "@/types";
import { MoveLeftIcon } from "lucide-react";

const steps = [
  {
    title: "Step One",
    route: "step-one",
    link: SignupRoutes.BASIC_DETAILS,
  },
  {
    title: "Step Two",
    route: "step-two",
    link: SignupRoutes.ADDRESS_DEATILS,
  },
  {
    title: "Step Three",
    route: "step-three",
    link: SignupRoutes.OTP_DEATAILS,
  },
  { title: "Review", route: "review", link: '/' },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(steps.findIndex((step) => step.route === currentPath));
  }, [currentPath]);

  return (
    <div className=" text-slate-400 flex flex-col items-center bg-white min-h-[80vh]  rounded-md shadow-xl w-[260px] p-5">
      {/* back button */}
      <Link
        href={steps[currentStep - 1]?.link || steps[0].link}
        className="mb-4 flex gap-5 flex-start mr-32 text-md disabled:text-white/50 lg:mb-8 lg:gap-1"
      >
        <MoveLeftIcon className="w-5" />
        Back
      </Link>

      {/* list of form steps */}
      <div className="relative flex flex-row justify-between w-[200px] lg:flex-col mr-5 lg:justify-start lg:gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex  gap-1 items-center h-1 w-full border-b border-dashed">
            {steps.map((_, index) => (
              <div
                key={index}
                className={clsx("flex-1 h-1", {
                  "bg-gray-800": index < currentStep,
                  "bg-gray-200": index >= currentStep,
                })}
              />
            ))}
          </div>
          <div className="text-sm">
            {currentStep}/{steps.length} Steps Completed
          </div>
        </div>

        {steps.map((step, i) => (
          <Link
            href={steps[i].link}
            key={step.link}
            className={clsx(
              "group z-20 flex items-center gap-3 text-xl px-2 py-1 rounded-md ",
              { "shadow-sm": currentPath === step.route }
            )}
            prefetch={true}
          >
            <span
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full border  text-sm   transition-colors duration-200  lg:h-10 lg:w-10  lg:text-lg",
                {
                  "bg-teal-500 text-xl  text-black group-hover:border-none group-hover:text-black lg:h-12 lg:w-12 ":
                    currentPath === step.route,
                  "border-white/75 bg-gray-700 group-hover:border-white group-hover:text-white text-white/75":
                    currentPath !== step.route,
                }
              )}
            >
              {i + 1}
            </span>
            <span
              className={clsx(
                "hidden lg:text-slate-500 transition-colors duration-200 text-lg   lg:block",
                {
                  "font-light group-hover:font-normal":
                    currentPath !== step.route,
                  "font-semibold text-xl": currentPath === step.route,
                }
              )}
            >
              {step.title}
            </span>
          </Link>
        ))}
        {/* mobile background dashes */}
        <div className="absolute top-4 flex h-1 w-full border-b border-dashed lg:hidden" />
      </div>
    </div>
  );
}
