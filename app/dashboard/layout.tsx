import SideNav from "@/app/ui/dashboard/sidenav";
import Header from "../ui/dashboard/header";
import { ProfileProvider } from "@/contexts/ProfleContext";
import { lusitana } from "../ui/fonts";

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
          <div className="flex-grow p-6 md:overflow-y-auto md:p-">
            {children}
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
