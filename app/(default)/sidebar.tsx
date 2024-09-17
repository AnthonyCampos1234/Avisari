"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiDollarSign, FiUser, FiLogOut, FiUsers, FiClipboard } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';

type SidebarProps = {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    userType: 'student' | 'advisor';
};

export default function Sidebar({ expanded, setExpanded, userType }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({ redirect: false });
        setIsLoggingOut(false);
        router.push('/');
    };

    const sidebarLinks = userType === 'student' ? [
        { icon: <FiHome />, title: "Home", href: "/student/dashboard" },
        { icon: <FiBook />, title: "Insight", href: "/student/dashboard/insight" },
        { icon: <FiDollarSign />, title: "Savior", href: "/student/dashboard/savior" },
        { icon: <FiUser />, title: "Profile", href: "/student/dashboard/profile" },
    ] : [
        { icon: <FiHome />, title: "Home", href: "/advisor/dashboard" },
        { icon: <FiUsers />, title: "Students", href: "/advisor/dashboard/students" },
        { icon: <FiClipboard />, title: "Approvals", href: "/advisor/dashboard/approvals" },
        { icon: <FiUser />, title: "Profile", href: "/advisor/dashboard/profile" },
    ];

    return (
        <div className={`fixed inset-y-0 left-0 z-30 transition-all duration-500 ease-in-out ${expanded ? "w-48" : "w-16"}`}>
            <div
                className="bg-white h-full rounded-r-3xl shadow-lg flex flex-col border-r border-gray-200"
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
                <div className="flex items-center justify-center h-16 mb-4">
                    <Image src="/images/logo-01.svg" alt="Logo" width={40} height={40} className="transition-all duration-500 ease-in-out" style={{ width: expanded ? '40px' : '32px' }} />
                </div>
                <div className="flex-grow flex flex-col items-center justify-start py-8">
                    {sidebarLinks.map((link) => (
                        <SidebarLink
                            key={link.href}
                            icon={link.icon}
                            title={link.title}
                            href={link.href}
                            expanded={expanded}
                            active={pathname === link.href}
                        />
                    ))}
                </div>
                <div className="mb-8 flex justify-center w-full">
                    <SidebarLink
                        icon={isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <FiLogOut />}
                        title="Logout"
                        href="/"
                        expanded={expanded}
                        active={false}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
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
    disabled,
}: {
    icon: React.ReactNode;
    title: string;
    href: string;
    expanded: boolean;
    active: boolean;
    onClick?: () => void;
    disabled?: boolean;
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
        } px-3 py-2 mb-2 text-gray-700 hover:bg-gray-100 rounded-full ${active ? "bg-gray-200 text-blue-600" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

    if (onClick) {
        return (
            <button onClick={onClick} className={className} disabled={disabled}>
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
