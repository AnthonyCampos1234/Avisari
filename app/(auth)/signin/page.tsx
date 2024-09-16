'use client';

import SignIn from '@/components/signin-form'
import Image from 'next/image'
import AuthImage from '@/public/images/auth-bg.svg'

export default function SignInPage() {
  return (
    <>
      {/* Illustration */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none -z-10" aria-hidden="true">
        <Image src={AuthImage} className="max-w-none" priority alt="Page Illustration" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Page header */}
          <div className="max-w-3xl mx-auto text-center pb-12">
            <h1 className="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-600 to-slate-300">Welcome back!</h1>
          </div>

          {/* Form */}
          <SignIn />

        </div>
      </div>
    </>
  )
}