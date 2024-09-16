"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import AuthLayout, { StyledInput, StyledButton } from '../layout';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push('/signin');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred during sign up');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <AuthLayout isSignUp>
      <form onSubmit={handleSubmit} className="space-y-6">
        <StyledInput
          icon={<FiUser className="text-gray-400" />}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <StyledInput
          icon={<FiMail className="text-gray-400" />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <StyledInput
          icon={<FiLock className="text-gray-400" />}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <StyledButton type="submit">Sign up</StyledButton>
      </form>
      <div className="mt-6 text-center">
        <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-900">
          Already have an account? Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}