import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#E9E3D7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Asheville's Best Events</h1>
          <p className="text-xl mb-8">Your guide to music, markets, food, art, and more happening around Asheville.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link href="/events" className="bg-blue-600 text-white text-center py-4 px-6 rounded-lg text-xl font-medium hover:bg-blue-700 transition-colors">
              Browse Events
            </Link>
            <Link href="/submit-event" className="bg-white text-blue-600 text-center py-4 px-6 rounded-lg text-xl font-medium hover:bg-gray-100 transition-colors border-2 border-blue-600">
              Submit an Event
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
          {/* Featured events would go here */}
          <div className="mt-8 text-center">
            <Link href="/events" className="text-blue-600 font-medium text-lg hover:underline">
              View all events →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}