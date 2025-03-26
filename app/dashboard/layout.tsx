import SideNav from "@/app/ui/dashboard/sidenav";
import Header from "../ui/dashboard/header";
import { ProfileProvider } from "@/contexts/ProfleContext";
import { lusitana } from "../ui/fonts";
import Breadcrumb from "../ui/dashboard/Breadcrumb";

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userId = 1;

  return (
    <ProfileProvider userId={userId}>
      <div className={`${lusitana.className} flex h-screen flex-col md:flex-row md:overflow-hidden`}>
        <div className="relative w-full flex flex-col md:w-64">
          <SideNav />
        </div>
        <div className="m-3">
          <Header />
          <Breadcrumb/>
          <div className="flex-grow p-1 md:overflow-y-auto md:p-1">
            {children}
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
