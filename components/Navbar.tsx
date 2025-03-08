"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  return (
    <nav className="bg-blue-500 p-4 shadow fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Coffee Shop Guide
        </Link>
        <div>
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Hello, {user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link
                    href="/signin"
                    className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-transparent text-white border border-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 