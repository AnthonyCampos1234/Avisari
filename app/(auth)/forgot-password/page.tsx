"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage("If an account exists for that email, a password reset link has been sent.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => router.push("/signin"), 3000);
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          {token ? "Reset Password" : "Forgot Password"}
        </h1>
      </div>

      {token ? (
        // Password reset form
        <form onSubmit={handlePasswordReset}>
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                id="password"
                className="form-input w-full py-2"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                className="form-input w-full py-2"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]">
              Reset Password
            </button>
          </div>
        </form>
      ) : (
        // Forgot password form
        <form onSubmit={handleForgotPassword}>
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                className="form-input w-full py-2"
                type="email"
                placeholder="corybarker@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]">
              Send Reset Link
            </button>
          </div>
        </form>
      )}

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
    </>
  );
}
