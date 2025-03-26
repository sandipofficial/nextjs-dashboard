"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // Remove empty segments

  return (
    <nav className="text-md p-2 text-gray-500">
      <ul className="flex items-center">
        {/* <li>
          <Link href="/" className="hover:underline ">
            Home
          </Link>
        </li> */}

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/"); // Construct path

          return (
            <li key={href} className="flex items-center hover:text-teal-500">
              <span className="mx-1">/ </span>
              <Link
                href={href}
                className="hover:underline capitalize "
              >
                {decodeURIComponent(segment)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
