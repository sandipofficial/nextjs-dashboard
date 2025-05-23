'use client';

import { UserIcon, LockClosedIcon, CogIcon, BellIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const profileLinks = [
  { name: 'Basic Details', href: '/dashboard/profile/edit', icon: UserIcon },
  { name: 'KYC', href: '/dashboard/profile/edit/kyc', icon: VideoCameraIcon },
  { name: 'Security', href: '/dashboard/profile/security', icon: LockClosedIcon },
  { name: 'Preferences', href: '/dashboard/profile/preferences', icon: CogIcon },
  { name: 'Notifications', href: '/dashboard/profile/notifications', icon: BellIcon },
];

export default function EditProfileNav() {
  const pathname = usePathname();
  return (
    <nav className="w-full md:w-60 border-r p-4  bg-gray-50">
      <div className="flex flex-col gap-2">
        {profileLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex items-center gap-2 rounded-md p-3 text-sm font-medium hover:text-teal-500 hover:bg-teal-50',
                {
                  'bg-teal-100 text-teal-700': pathname === link.href,
                }
              )}
            >
              <LinkIcon className="w-6" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
