import SideNav from "@/app/ui/dashboard/sidenav";
import Header from "../ui/dashboard/header";
import { ProfileProvider } from "@/contexts/ProfleContext";
import { lusitana } from "../ui/fonts";
import Breadcrumb from "../ui/dashboard/Breadcrumb";
import { auth } from "@/auth";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
const session = await auth()


  return (
    <ProfileProvider emailId={session?.user?.email || ""}>
      <div className={`${lusitana.className} flex h-screen flex-col md:flex-row md:overflow-hidden`}>
        <div className="relative w-full flex flex-col md:w-64">
          <SideNav />
        </div>
        <div className="m-3">
          <Header />
          <Breadcrumb/>
          <div className="flex-grow p-1 md:overflow-y-auto md:scrollbar-hide md:p-1 ">
            {children}
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
