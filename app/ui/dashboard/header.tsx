import Link from "next/link";
import AcmeLogo from "../acme-logo";

export default function Header() {
    return (
        <div className=" w-7xl">
            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-20"
                href="/"
            >
                <div className="w-32 text-white md:w-40">
                    <AcmeLogo />
                </div>
            </Link>
        </div>
    )
}