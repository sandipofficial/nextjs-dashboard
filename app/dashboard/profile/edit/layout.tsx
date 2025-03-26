import EditProfileNav from "@/app/ui/dashboard/profile/edit/EditProfileNav";
import HeroProfile from "@/app/ui/dashboard/profile/edit/HeroProfile";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full relative">
      <HeroProfile />
      <div className="flex">
        <EditProfileNav />

        <div>{children}</div>
      </div>
    </div>
  );
}
