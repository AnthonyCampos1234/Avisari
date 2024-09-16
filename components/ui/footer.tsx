'use client'

import Link from "next/link";

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`py-8 ${border ? "border-t" : ""}`}>
          <div>
            {/* Temporarily replace Image with plain text */}
            <div>Avisari Logo</div>
            <div className="text-sm text-gray-600">
              &copy; avisari.com - All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
