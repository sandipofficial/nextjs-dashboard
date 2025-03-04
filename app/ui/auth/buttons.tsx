import Link from "next/link";

export function Signup() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Sign Up</span>{" "}
    </Link>
  );
}

export function Login() {
  return (
    <Link
      href="/auth/login"
      className="bg-accent text-background w-[6rem] flex justify-center py-1 cursor-pointer hover:bg-primary hover:border hover:rounded-md "
    >
      <span>Log in</span>
    </Link>
  );
}

type NextButtonProps = {
  nextStep: () => void; // Function that doesn't return anything
};

export function NextButton({ nextStep }: NextButtonProps) {
  return (
    <div>
      <button onClick={nextStep} className="bg-accent mx-auto text-background w-[14rem] flex justify-center py-1 cursor-pointer hover:bg-primary hover:border rounded-md">
        Next
      </button>
    </div>
  );
}


