import Link from "next/link"
import AcmeLogo from "../acme-logo"
import { Login } from "./buttons";

export default function Header ()  {
    const HeaderTabs = [
        { id: 1, title: "About", href: "/" },
        { id: 2, title: "Services", href: "/" },
        { id: 3, title: "Features", href: "/" },
        { id: 4, title: "Contact", href: "/" },
      ];
    return (
        <div className="flex justify-between items-center h-20 shrink-0 border md:h-14">
                <AcmeLogo />
                <div className="flex gap-6 ">
                  {HeaderTabs.map((tab) => (
                    <Link
                      href={tab.href}
                      key={tab.id}
                      className="font-semibold relative p-2 cursor-pointer hover:shadow-sm after:block after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100"
                    >
                      {tab.title}
                    </Link>
                  ))}
                </div>
                <Login/>
              </div>
    )
}