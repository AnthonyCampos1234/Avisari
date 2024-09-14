"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
    const { session, status } = useAuth(true);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user?.name}!</p>
        </div>
    );
}