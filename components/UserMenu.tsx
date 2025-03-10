"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={toggleMenu}
        className="flex items-center justify-center bg-white rounded-full w-12 h-12 focus:outline-none border-2 border-gray-200"
        aria-expanded={isOpen}
      >
        {user ? (
          <Image 
            src={user.user_metadata?.avatar_url || "/images/avatar.svg"} 
            alt="User avatar" 
            width={48} 
            height={48} 
            className="rounded-full object-cover"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          {user ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">Logged in</p>
              </div>
              <div className="py-2">
                <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Profile
                </Link>
                <Link href="/my-events" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  My Events
                </Link>
                <button 
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-xl text-gray-900">SIGN UP</h3>
              </div>
              <div className="py-2">
                <Link href="/signup" className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100">
                  <span className="font-medium">SIGN UP</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="/signin" className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100">
                  <span className="font-medium">LOG IN</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <div className="border-t border-gray-200 mt-2"></div>
                <Link href="https://frequentflyer.beehiiv.com" className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100">
                  <span className="font-medium">NEWSLETTER</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 