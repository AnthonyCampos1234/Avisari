"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { IconButton } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';

export default function Dashboard() {
    const { session, status } = useAuth(true);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 bg-white min-h-screen flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {session?.user?.name}!</h1>
                    <div className="grid gap-6 md:grid-cols-3">
                        <DashboardPreview
                            title="Insight"
                            icon={<AssessmentIcon />}
                            content={
                                <>
                                    <p className="mb-2">Current GPA: 3.5</p>
                                    <p className="mb-2">Credits completed: 60/120</p>
                                    <p className="font-semibold">Next recommended course:</p>
                                    <p>Advanced Algorithms</p>
                                </>
                            }
                            linkHref="/dashboard/insight"
                        />
                        <DashboardPreview
                            title="Savior"
                            icon={<AttachMoneyIcon />}
                            content={
                                <>
                                    <p className="mb-2">Tuition balance: $5,000</p>
                                    <p className="mb-2">Scholarship opportunities: 3 new</p>
                                    <p className="font-semibold">Tip:</p>
                                    <p>Apply for Merit Scholarship by June 1st</p>
                                </>
                            }
                            linkHref="/dashboard/savior"
                        />
                        <DashboardPreview
                            title="Profile"
                            icon={<PersonIcon />}
                            content={
                                <>
                                    <p className="mb-2">Name: {session?.user?.name}</p>
                                    <p className="mb-2">Email: {session?.user?.email}</p>
                                    <p className="font-semibold">Action needed:</p>
                                    <p>Update your contact information</p>
                                </>
                            }
                            linkHref="/dashboard/profile"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardPreview({ title, icon, content, linkHref }: {
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
    linkHref: string;
}) {
    return (
        <Link href={linkHref} className="block">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                    <IconButton className="mr-2 bg-gray-200">
                        {icon}
                    </IconButton>
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="text-gray-600">
                    {content}
                </div>
            </div>
        </Link>
    );
}