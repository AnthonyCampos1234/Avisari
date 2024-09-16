"use client";

import { usePathname } from 'next/navigation';
import Image from "next/image";
import Logo from "@/components/ui/logo";
import AuthBg from "@/public/images/auth-bg.svg";
import PageIllustration from "@/components/page-illustration";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative">
      <PageIllustration />
      <header className="absolute z-30 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Site branding */}
            <div className="mr-4 shrink-0">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex grow">
        <div
          className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/3"
          aria-hidden="true"
        >
          <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-blue-500 opacity-70 blur-[160px]"></div>
        </div>

        {/* Content */}
        <div className="w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="pb-12 pt-24 md:pb-20 md:pt-32">
              {/* Section header */}
              <div className="text-center mb-8">
                <h1
                  className="mb-2 text-3xl font-bold md:text-4xl"
                  data-aos="zoom-y-out"
                  data-aos-delay={150}
                >
                  Nota Solutions
                </h1>
                <p
                  className="text-sm text-gray-600 italic"
                  data-aos="zoom-y-out"
                  data-aos-delay={300}
                >
                  Simplifying complexity, one university at a time
                </p>
              </div>

              {/* Auth form */}
              <div className="mx-auto w-full max-w-sm">
                <div className="py-6 md:py-8">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}