"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Dashboard() {
    const { session, status } = useAuth(true);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
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
            <Link href={linkHref} className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                {linkText}
            </Link>
        </div>
    );
}