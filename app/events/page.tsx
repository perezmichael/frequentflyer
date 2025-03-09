"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';

// Event types with emojis for filtering
const EVENT_TYPES = [
  { value: "all", label: "🌟 All Events" },
  { value: "music", label: "🎶 Music" },
  { value: "markets", label: "🛍️ Markets & Flea Markets" },
  { value: "food-drink", label: "🍹 Food & Drink" },
  { value: "wellness", label: "🧘 Wellness" },
  { value: "art-cultural", label: "🎨 Art & Cultural" },
  { value: "workshops", label: "🛠️ Workshops & Classes" },
  { value: "community", label: "🌳 Community" },
  { value: "charity", label: "💛 Charity & Benefit" },
  { value: "holiday", label: "🎉 Holiday & Seasonal" },
  { value: "film", label: "🎥 Film Screenings & Movie Nights" },
  { value: "nightlife", label: "🌙 Nightlife" },
  { value: "sports", label: "🏃 Sports" },
  { value: "educational", label: "📚 Educational" },
  { value: "kids-family", label: "🧸 Kids & Family" },
  { value: "popup", label: "🏗️ Pop-Up" },
  { value: "cultural-celebrations", label: "🏮 Cultural Celebrations" },
  { value: "gaming", label: "🎮 Gaming" },
  { value: "networking", label: "🤝 Networking" },
  { value: "outdoor", label: "🏞️ Outdoor Adventures" },
  { value: "literary", label: "📖 Book Clubs & Literary" }
];

// PlaceholderImage component for when no image is available
const PlaceholderImage = () => (
  <div className="bg-gray-200 flex items-center justify-center w-full h-full">
    <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 0 486.1 0 456.1L0 456.1z" />
    </svg>
  </div>
);

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        
        // Start with a query for approved events
        let query = supabase
          .from('events')
          .select('*')
          .eq('status', 'approved')
          .order('date', { ascending: true });
        
        // Apply event type filter if not "all"
        if (selectedType !== "all") {
          query = query.eq('event_type', selectedType);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Format the events data
        const formattedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date ? format(parseISO(event.date), 'EEEE, MMMM d, yyyy') : 'Date TBD',
          time: event.date ? format(parseISO(event.date), 'h:mm a') : 'Time TBD',
          location: event.location,
          price: event.price || 'Free',
          imageUrl: event.image_url,
          eventType: event.event_type,
          slug: event.slug
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, [selectedType]); // Re-fetch when filter changes

  // Filter events by search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.description.toLowerCase().includes(search.toLowerCase()) ||
    event.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            {/* Event type filter */}
            <div className="w-full md:w-1/2">
              <select
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {EVENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Submit event button */}
        <div className="mb-8 flex justify-end">
          <Link href="/submit-event" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
            Submit an Event
          </Link>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* No events found */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              {selectedType !== "all" 
                ? "Try selecting a different event type or check back later."
                : search 
                  ? "Try a different search term or check back later."
                  : "Check back later for upcoming events."}
            </p>
          </div>
        )}
        
        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const placeholder = document.createElement('div');
                      placeholder.className = "absolute inset-0";
                      const placeholderComponent = document.createElement('div');
                      placeholderComponent.className = "bg-gray-200 flex items-center justify-center w-full h-full";
                      placeholderComponent.innerHTML = `<svg class="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 0 486.1 0 456.1L0 456.1z"/></svg>`;
                      placeholder.appendChild(placeholderComponent);
                      e.currentTarget.parentElement.appendChild(placeholder);
                    }}
                  />
                ) : (
                  <PlaceholderImage />
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">{event.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {event.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="border-t pt-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 