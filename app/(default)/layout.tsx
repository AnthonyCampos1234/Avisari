"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import Image from 'next/image';

import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Sidebar from "@/app/(default)/sidebar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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

  if (status === "authenticated") {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <Image src="/images/logo-01.svg" alt="Logo" width={40} height={40} />
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
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
