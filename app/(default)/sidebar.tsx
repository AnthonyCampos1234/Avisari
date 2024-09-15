"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiDollarSign, FiUser, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type SidebarProps = {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
};

export default function Sidebar({ expanded, setExpanded }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-30 transition-all duration-500 ease-in-out ${expanded ? "w-48" : "w-16"}`}>
            <div
                className="bg-white h-full rounded-r-3xl shadow-lg flex flex-col"
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                <div className="flex-grow flex flex-col items-center justify-start py-8">
                    <SidebarLink
                        icon={<FiHome />}
                        title="Home"
                        href="/dashboard"
                        expanded={expanded}
                        active={pathname === "/dashboard"}
                    />
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
                <div className="mb-8 flex justify-center w-full">
                    <SidebarLink
                        icon={<FiLogOut />}
                        title="Logout"
                        href="/"
                        expanded={expanded}
                        active={false}
                        onClick={handleLogout}
                    />
                </div>
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
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    href: string;
    expanded: boolean;
    active: boolean;
    onClick?: () => void;
}) {
    const content = (
        <>
            <div className={`flex items-center justify-center ${expanded ? "w-10" : "w-full"} transition-all duration-500 ease-in-out`}>
                <span className="text-lg">{icon}</span>
            </div>
            <span
                className={`ml-3 text-sm overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0"
                    }`}
            >
                {title}
            </span>
        </>
    );

    const className = `flex items-center ${expanded ? "w-[calc(100%-8px)] mx-1" : "w-10"
        } px-3 py-2 mb-2 text-gray-700 hover:bg-gray-200 rounded-full ${active ? "bg-black text-white" : ""
        }`;

    if (onClick) {
        return (
            <button onClick={onClick} className={className}>
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className={className}>
            {content}
        </Link>
    );
}
