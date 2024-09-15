import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiDollarSign, FiUser } from "react-icons/fi";

type SidebarProps = {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
};

export default function DashboardSidebar({ expanded, setExpanded }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="p-4 flex items-center">
            <div
                className={`bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg transition-all duration-700 ease-in-out flex flex-col justify-center py-4 ${expanded ? "w-48" : "w-16"
                    }`}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
            >
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
            className={`flex items-center justify-center px-3 py-2 mb-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 ${active ? "bg-black text-white" : ""
                }`}
        >
            <span className="text-lg">{icon}</span>
            {expanded && <span className="ml-3 text-sm">{title}</span>}
        </Link>
    );
}