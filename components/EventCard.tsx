import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../utils/dateUtils';

export default function EventCard({ event }) {
  // Format the date for display
  const formattedDate = formatDate(event.date);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{event.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{formattedDate}</p>
          </div>
          
          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
            {event.event_type}
          </div>
        </div>
        
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{event.description}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="truncate">{event.location}</span>
        </div>
        
        {event.price && (
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{event.price}</span>
          </div>
        )}
        
        <Link 
          href={`/events/${event.slug}`}
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 