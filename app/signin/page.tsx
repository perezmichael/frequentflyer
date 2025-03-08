"use client";

import SignIn from '../../components/SignIn';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation'; // Note: use next/navigation in App Router
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center pt-16">
        <SignIn />
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/reset-password" className="text-blue-500 hover:text-blue-700">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
} 