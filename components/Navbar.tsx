import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#E9E3D7] shadow-lg' : 'bg-[#E9E3D7]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/frequent-flyer-logo.png" 
                  alt="Frequent Flyer Logo" 
                  width={96} 
                  height={50} 
                  className="h-8 w-auto"
                />
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className={`uppercase px-3 py-2 rounded-md text-[20px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
                Home
              </Link>
              <Link href="/events" className={`uppercase px-3 py-2 rounded-md text-[20px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
                Events
              </Link>
              <Link href="/submit-event" className={`uppercase px-3 py-2 rounded-md text-[20px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
                Submit Event
              </Link>
              <Link href="/submit-event" className={`uppercase px-3 py-2 rounded-md text-[20px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
                Sign In
              </Link>
             
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#181B22] hover:text-[#181B22]/80 hover:bg-[#E9E3D7]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#E9E3D7] focus:ring-[#181B22]"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
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

      {isOpen && (
        <div className="md:hidden bg-[#E9E3D7]" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className={`uppercase block px-3 py-2 rounded-md text-[24px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
              Home
            </Link>
            <Link href="/events" className={`uppercase block px-3 py-2 rounded-md text-[24px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
              Events
            </Link>
            <Link href="/submit-event" className={`uppercase block px-3 py-2 rounded-md text-[24px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
              Submit Event
            </Link>
            <Link href="/about" className={`uppercase block px-3 py-2 rounded-md text-[24px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
              About
            </Link>
            <Link href="/contact" className={`uppercase block px-3 py-2 rounded-md text-[24px] font-medium text-[#181B22] hover:text-[#181B22]/80`}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}