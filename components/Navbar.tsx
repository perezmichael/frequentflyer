"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#E9E3D7] shadow-md fixed top-0 left-0 right-0 z-10 flex items-center" style={{ height: '80px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div style={{ width: '240px', height: '60px', position: 'relative' }}>
                <Image
                  src="/images/FFMainLogo.png"
                  alt="Frequent Flyer Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-gray-900 hover:text-gray-600 text-2xl font-medium uppercase">
              Events
            </Link>
            <Link href="/submit-event" className="text-gray-900 hover:text-gray-600 text-2xl font-medium uppercase">
              Submit Event
            </Link>
            <a 
              href="https://frequentflyer.beehiiv.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-900 hover:text-gray-600 text-2xl font-medium uppercase"
            >
              Newsletter
            </a>
            <UserMenu />
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
            <UserMenu />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#E9E3D7] shadow-md">
            <Link href="/events" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 uppercase">
              Events
            </Link>
            <Link href="/submit-event" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 uppercase">
              Submit Event
            </Link>
            <a 
              href="https://frequentflyer.beehiiv.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-600 hover:bg-gray-50 uppercase"
            >
              Newsletter
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}