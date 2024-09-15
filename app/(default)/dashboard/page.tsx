"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FiHome, FiBook, FiDollarSign, FiUser } from "react-icons/fi";

export default function Dashboard() {
    const { session, status } = useAuth(true);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="p-4">
                <div
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg transition-all duration-500 ease-in-out h-[calc(100vh-2rem)] flex flex-col justify-start py-4 ${sidebarExpanded ? 'w-48' : 'w-16'}`}
                    onMouseEnter={() => setSidebarExpanded(true)}
                    onMouseLeave={() => setSidebarExpanded(false)}
                >
                    <SidebarLink icon={<FiHome />} title="Home" href="/dashboard" expanded={sidebarExpanded} />
                    <SidebarLink icon={<FiBook />} title="Insight" href="/dashboard/insight" expanded={sidebarExpanded} />
                    <SidebarLink icon={<FiDollarSign />} title="Savior" href="/dashboard/savior" expanded={sidebarExpanded} />
                    <SidebarLink icon={<FiUser />} title="Profile" href="/dashboard/profile" expanded={sidebarExpanded} />
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/90 backdrop-blur-sm p-4 shadow z-10">
                    <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name}!</h1>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 mt-16">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Insight Section */}
                        <DashboardCard
                            title="Insight"
                            description="Build your college schedule and connect with academic advisors."
                            linkText="Go to Insight"
                            linkHref="/dashboard/insight"
                        />

                        {/* Savior Section */}
                        <DashboardCard
                            title="Savior"
                            description="Get financial advice and connect with student financial advisors."
                            linkText="Go to Savior"
                            linkHref="/dashboard/savior"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ icon, title, href, expanded }: { icon: React.ReactNode; title: string; href: string; expanded: boolean }) {
    return (
        <Link href={href} className="flex items-center px-3 py-2 my-1 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200">
            <span className="text-lg">{icon}</span>
            {expanded && <span className="ml-3 text-sm">{title}</span>}
        </Link>
    );
}

function DashboardCard({ title, description, linkText, linkHref }: {
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
}) {
    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="mb-4 text-gray-600">{description}</p>
            <Link href={linkHref} className="text-blue-500 hover:underline">
                {linkText}
            </Link>
        </div>
    );
}