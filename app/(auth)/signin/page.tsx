"use client";

import dynamic from 'next/dynamic';

const SignInComponent = dynamic(() => import('./SignInComponent'), { ssr: false });

export default function SignIn() {
  return <SignInComponent />;
}