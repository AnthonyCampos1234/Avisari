"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock } from 'react-icons/fi';
import AuthLayout, { ModernInput, StyledButton } from '../layout';

export default function SignIn() {
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
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          {isLoading ? 'Signing in...' : 'Sign in'}
        </StyledButton>
      </form>
      <div className="mt-6 text-center">
        <Link href="/signup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Don't have an account? Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}