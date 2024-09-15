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
        <div className="flex h-screen bg-gray-100 pt-16">
            {/* Sidebar */}
            <div className="p-4 flex items-center">
                <div
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg transition-all duration-500 ease-in-out h-[50vh] flex flex-col justify-start py-6 ${sidebarExpanded ? 'w-48' : 'w-16'}`}
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
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <h1 className="text-2xl font-semibold mb-6">Welcome, {session?.user?.name}!</h1>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Insight Section */}
                    <DashboardCard
                        title="Insight"
                        description="Your academic progress and recommendations"
                        content={
                            <>
                                <p className="mb-2">Current GPA: 3.5</p>
                                <p className="mb-2">Credits completed: 60/120</p>
                                <p className="font-semibold">Recommendation:</p>
                                <p>Consider taking Advanced Algorithms next semester to strengthen your CS major.</p>
                            </>
                        }
                        linkText="Go to Insight"
                        linkHref="/dashboard/insight"
                    />

                    {/* Savior Section */}
                    <DashboardCard
                        title="Savior"
                        description="Your financial overview and tips"
                        content={
                            <>
                                <p className="mb-2">Tuition balance: $5,000</p>
                                <p className="mb-2">Scholarship opportunities: 3 new</p>
                                <p className="font-semibold">Tip:</p>
                                <p>Apply for the Merit Scholarship by June 1st to potentially save $2,500 on next semester's tuition.</p>
                            </>
                        }
                        linkText="Go to Savior"
                        linkHref="/dashboard/savior"
                    />
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ icon, title, href, expanded }: { icon: React.ReactNode; title: string; href: string; expanded: boolean }) {
    return (
        <Link href={href} className="flex items-center px-3 py-2 mb-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200">
            <span className="text-lg">{icon}</span>
            {expanded && <span className="ml-3 text-sm">{title}</span>}
        </Link>
    );
}

function DashboardCard({ title, description, content, linkText, linkHref }: {
    title: string;
    description: string;
    content: React.ReactNode;
    linkText: string;
    linkHref: string;
}) {
    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="mb-4 text-gray-600">{description}</p>
            <div className="mb-4">{content}</div>
            <Link href={linkHref} className="text-blue-500 hover:underline">
                {linkText}
            </Link>
        </div>
    );
}