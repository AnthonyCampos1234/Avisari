"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

  const isDashboardRoute = pathname?.startsWith("/dashboard");

  if (status === "authenticated") {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-shrink-0">
          <Sidebar
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 pl-20 pt-4">
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
