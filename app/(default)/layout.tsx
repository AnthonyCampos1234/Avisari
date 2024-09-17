"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Sidebar from "@/app/(default)/sidebar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const userType = session?.user?.userType;
      const isInCorrectSection =
        (userType === 'student' && pathname.startsWith('/student')) ||
        (userType === 'advisor' && pathname.startsWith('/advisor'));

      if (!isInCorrectSection) {
        const basePath = userType === 'student' ? '/student' : '/advisor';
        router.push(`${basePath}/dashboard`);
      }
    } else if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, session, pathname, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    const showHeader = !pathname.includes('/dashboard');
    const userType = session?.user?.userType as 'student' | 'advisor';
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} userType={userType} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {showHeader && <Header />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return null;
}
