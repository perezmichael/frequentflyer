import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#E9E3D7]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">LA's Local Event Guide</h1>
              <p className="text-xl mb-8">Discover the best music, markets, food, art, and community events happening around LA.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/events" className="bg-blue-600 text-white text-center py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                  Browse Events
                </Link>
                <Link href="/submit-event" className="bg-white text-blue-600 text-center py-3 px-6 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors border-2 border-blue-600">
                  Submit an Event
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px]">
              <Image 
                src="/images/LosAngeles.jpg" 
                alt="Asheville scene" 
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
          
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Events</h2>
              <Link href="/events" className="text-blue-600 font-medium hover:underline">
                View all →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated with your actual events */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gray-200"></div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">Fri, Jun 23</div>
                    <h3 className="text-xl font-semibold mb-2">Event Title</h3>
                    <p className="text-gray-600 mb-3">Downtown Asheville</p>
                    <Link href={`/events/${i}`} className="text-blue-600 font-medium hover:underline">
                      View details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="bg-white p-8 rounded-lg shadow-md mb-16">
            <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-lg mb-6">Get weekly updates on the best events happening in Asheville delivered straight to your inbox.</p>
            <a 
              href="https://frequentflyer.beehiiv.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Subscribe Now
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}