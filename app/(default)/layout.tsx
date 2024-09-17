"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  useEffect(() => {
    if (status === "authenticated") {
      const userType = session?.user?.userType;
      const currentPath = pathname.split('/')[2]; // Get the second part of the path (e.g., 'dashboard', 'insight', 'savior')

      if (userType === 'student' && !pathname.includes('/student')) {
        router.push(`/student/${currentPath}`);
      } else if (userType === 'advisor' && !pathname.includes('/advisor')) {
        router.push(`/advisor/${currentPath}`);
      }
    }
  }, [status, session, pathname, router]);

  if (status === "authenticated") {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Avisari</h1>
            </div>
          </header>
          <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-500 ease-in-out ${sidebarExpanded ? "ml-48" : "ml-16"}`}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Footer border={true} />
    </>
  );
}
