"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ onSearch }: { onSearch?: (query: string) => void }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const isActive = (path: string) => {
    return pathname === path ? "border-b-2 border-white" : "";
  };

  return (
    <nav className="bg-blue-500 p-4 shadow fixed top-0 w-full z-10">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="text-white font-bold text-xl mr-2">
              Frequent Flyer
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="order-4 md:order-2 w-full md:w-auto flex justify-center mt-4 md:mt-0">
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/guides" 
                className={`text-white hover:text-blue-100 font-medium ${isActive('/guides')} pb-1`}
              >
                Guides
              </Link>
            </li>
            <li>
              <Link 
                href="/events" 
                className={`text-white hover:text-blue-100 font-medium ${isActive('/events')} pb-1`}
              >
                Events
              </Link>
            </li>
            <li>
              <Link 
                href="/submit-event" 
                className={`text-white hover:text-blue-100 font-medium ${isActive('/submit-event')} pb-1`}
              >
                Submit Event
              </Link>
            </li>
            <li>
              <a 
                href="https://frequentflyer.beehiiv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-100 font-medium flex items-center"
              >
                Newsletter
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="order-3 md:order-3 w-full md:w-auto mt-4 md:mt-0 md:flex-grow md:max-w-md mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Auth Buttons */}
        <div className="order-2 md:order-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white hidden md:inline">Hello, {user.email}</span>
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