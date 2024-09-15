"use client";

import Link from "next/link";
import Logo from "./logo";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 rounded-b-2xl bg-white/70 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop sign in links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
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
