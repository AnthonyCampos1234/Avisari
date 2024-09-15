"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiDollarSign, FiUser } from "react-icons/fi";

type SidebarProps = {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
};

export default function Sidebar({ expanded, setExpanded }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="h-full">
            <div
                className={`h-full bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-500 ease-in-out flex flex-col items-center py-4 ${expanded ? "w-48" : "w-16"
                    }`}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                <SidebarLink
                    icon={<FiBook />}
                    title="Insight"
                    href="/dashboard/insight"
                    expanded={expanded}
                    active={pathname === "/dashboard/insight"}
                />
                <SidebarLink
                    icon={<FiDollarSign />}
                    title="Savior"
                    href="/dashboard/savior"
                    expanded={expanded}
                    active={pathname === "/dashboard/savior"}
                />
                <SidebarLink
                    icon={<FiUser />}
                    title="Profile"
                    href="/dashboard/profile"
                    expanded={expanded}
                    active={pathname === "/dashboard/profile"}
                />
            </div>
        </div>
    );
}

function SidebarLink({
    icon,
    title,
    href,
    expanded,
    active,
}: {
    icon: React.ReactNode;
    title: string;
    href: string;
    expanded: boolean;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center ${expanded ? "w-full" : "w-10"
                } px-3 py-2 mb-2 text-gray-700 hover:bg-gray-200 rounded-full ${active ? "bg-black text-white" : ""
                }`}
        >
            <div className={`flex items-center justify-center ${expanded ? "w-10" : "w-full"} transition-all duration-500 ease-in-out`}>
                <span className="text-lg">{icon}</span>
            </div>
            <span
                className={`ml-3 text-sm overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"
                    }`}
            >
                {title}
            </span>
        </Link>
    );
}
