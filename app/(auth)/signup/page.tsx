"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import AuthLayout, { ModernInput, StyledButton } from '../layout';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout isSignUp>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ModernInput
          icon={<FiUser />}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <ModernInput
          icon={<FiMail />}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <ModernInput
          icon={<FiLock />}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <StyledButton type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign up'}
        </StyledButton>
      </form>
      <div className="mt-6 text-center">
        <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Already have an account? Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}