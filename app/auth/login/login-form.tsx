"use client";

import { lusitana } from "@/app/ui/fonts";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { signIn } from "next-auth/react"; // ✅ Import NextAuth signIn function
import Input from "@/app/ui/auth/signup/Input";
import { FormErrors, LandingPageRoutes } from "@/types";
import SubmitButton from "@/app/ui/auth/buttons";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Google from "../../../public/Google.png";
import Microsoft from "../../../public/Microsoft.png";
import Github from "../../../public/Github.png";
import { loginAction } from "./action";

const initialState: FormErrors = {};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetAuthStorage } = useAuthContext();
  const callbackUrl = searchParams.get("callbackUrl") || LandingPageRoutes.DASHBOARD;

  const [serverErrors, formAction] = React.useActionState(
    async (prevState: FormErrors | undefined, formData: FormData) => {
      const errors = await loginAction(prevState, formData);

      if (!errors) {
        resetAuthStorage();
        router.refresh(); // ✅ Ensures UI updates after redirect
      }

      return errors;
    },
    initialState
  );

  const socialLogins = [
    { provider: "google", text: "Google", logo: Google, width: 40, height: 40 },
    { provider: "microsoft", text: "Microsoft", logo: Microsoft, width: 110, height: 10 },
    { provider: "github", text: "Github", logo: Github, width: 50, height: 60 },
  ];

  return (
    <form
      action={formAction}
      className="flex justify-center h-[30rem] bg-white shadow-md rounded-lg w-[85%]"
    >
      <div className="flex flex-col rounded-lg items-center w-full space-y-3 px-6 pb-4 pt-8">
        <div className={`${lusitana.className} text-2xl flex flex-col items-center`}>
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <h2 className="font-medium">Please log in to continue.</h2>
        </div>

        <div className="w-[90%] space-y-3">
          <Input label="Email" id="email" type="email" placeholder="Enter your email" required errorMsg={serverErrors?.email} />
          <Input label="Password" id="password" type="password" placeholder="Enter password" required errorMsg={serverErrors?.password} />
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <SubmitButton text="Login" verified={true} />

        <div className="text-[0.8rem]">
          Forgot{" "}
          <Link className="hover:text-teal-500" href={LandingPageRoutes.FORGOT_USER}>
            Email Id
          </Link>{" "}
          |{" "}
          <Link className="hover:text-teal-500" href={LandingPageRoutes.RESET_PASSWORD_REQUEST}>
            Password
          </Link>{" "}
          ?
        </div>

        <div className="text-[0.8rem]">
          Not registered? |{" "}
          <Link className="hover:text-teal-500" href={LandingPageRoutes.SIGN_UP}>
            SignUp
          </Link>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex justify-center items-center space-x-2">
            <div className="h-0.5 bg-teal-700 w-24"></div>
            <div className="text-md">Or Login With</div>
            <div className="h-0.5 bg-teal-700 w-24"></div>
          </div>

          <div className="flex justify-center w-full items-center space-x-4">
            {socialLogins.map((login) => (
              <button
                key={login.provider}
                onClick={() => signIn(login.provider, { callbackUrl })}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                <Image src={login.logo} alt={login.text} width={login.width} height={login.height} className="object-cover h-8" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
