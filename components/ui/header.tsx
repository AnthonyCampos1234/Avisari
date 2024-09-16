"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Logo01 from "@/public/images/logo-01.svg";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative mx-auto max-w-[90%] flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(theme(colors.gray.100),theme(colors.gray.200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Site branding */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={Logo01}
                alt="Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <span className="text-lg font-semibold text-gray-800">Avisari</span>
            </Link>
          </div>

          {/* Desktop sign in links */}
          <ul className="flex items-center gap-3">
            {status === "authenticated" ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="btn-sm bg-gray-800 text-gray-200 shadow hover:bg-gray-900"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/signin"
                    className="btn-sm bg-white text-gray-800 shadow hover:bg-gray-50"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="btn-sm bg-gray-800 text-gray-200 shadow hover:bg-gray-900"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
