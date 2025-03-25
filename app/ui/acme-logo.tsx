import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} h-10  flex flex-row gap-1 justify-center  items-center cursor-pointer text-white`}
    >
      <GlobeAltIcon className="h-10 w-10 rotate-[15deg]" />
      <p className="text-[32px]">Finance</p>
    </div>
  );
}
