"use client";

import React from 'react';
import Link from "next/link";
import { FiUser, FiLock } from "react-icons/fi";
import Logo from "@/components/ui/logo";

export default function AuthLayout({
  children,
  isSignUp = false
}: {
  children: React.ReactNode;
  isSignUp?: boolean;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar-inspired left panel */}
      <div className="hidden md:flex md:flex-col md:justify-between md:w-64 bg-white shadow-lg rounded-r-3xl p-8">
        <div>
          <Logo />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Welcome to Nota Solutions
          </h2>
          <p className="mt-2 text-gray-600">
            AI-powered solutions for higher education
          </p>
        </div>
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            © 2023 Nota Solutions. All rights reserved.
          </p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// You can use these styled components in your sign-in and sign-up forms
export function StyledInput({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="relative rounded-full mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
        {...props}
      />
    </div>
  );
}

export function StyledButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
      {...props}
    >
      {children}
    </button>
  );
}