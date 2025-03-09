"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay, addDays } from 'date-fns';

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

// Date filter options
const DATE_FILTERS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-week", label: "This Week" },
  { value: "this-weekend", label: "This Weekend" },
  { value: "next-week", label: "Next Week" },
  { value: "next-month", label: "Next Month" }
];

// PlaceholderImage component for when no image is available
const PlaceholderImage = () => (
  <div className="bg-gray-900 flex items-center justify-center w-full h-64">
    <svg className="w-12 h-12 text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
      <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 0 486.1 0 456.1L0 456.1z" />
    </svg>
  </div>
);

// Function to get event type with emoji
function getEventTypeWithEmoji(eventType) {
  const eventTypeObj = EVENT_TYPES.find(type => type.value === eventType);
  return eventTypeObj ? eventTypeObj.label : eventType;
}

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
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
          eventTypeWithEmoji: getEventTypeWithEmoji(event.event_type),
          slug: event.slug,
          status: event.status,
          formattedDate: event.date ? format(parseISO(event.date), 'EEEE, MMMM d') : 'Date TBD',
          shortDate: event.date ? format(parseISO(event.date), 'MMMM d') : 'TBD',
          dayOfWeek: event.date ? format(parseISO(event.date), 'EEEE').toUpperCase() : '',
          dayOfMonth: event.date ? format(parseISO(event.date), 'd') : '',
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`,
          rawDate: event.date ? parseISO(event.date) : null,
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

  // Filter events by search term, event type, and date
  const filteredEvents = events.filter(event => {
    // Text search filter
    const matchesSearch = 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());
    
    // Date filter
    let matchesDate = true;
    
    if (selectedDate !== "all" && event.rawDate) {
      const today = startOfDay(new Date());
      const tomorrow = startOfDay(addDays(today, 1));
      const nextWeekStart = startOfDay(addDays(today, 7));
      const nextMonthStart = startOfDay(addDays(today, 30));
      
      // Get day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = event.rawDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Saturday or Sunday
      
      // Calculate this weekend (next Saturday and Sunday)
      const daysUntilWeekend = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
      const thisWeekendStart = startOfDay(addDays(today, daysUntilWeekend));
      const thisWeekendEnd = endOfDay(addDays(thisWeekendStart, isWeekend ? 0 : 1));
      
      switch (selectedDate) {
        case "today":
          matchesDate = isAfter(event.rawDate, startOfDay(today)) && 
                        isBefore(event.rawDate, endOfDay(today));
          break;
        case "tomorrow":
          matchesDate = isAfter(event.rawDate, startOfDay(tomorrow)) && 
                        isBefore(event.rawDate, endOfDay(tomorrow));
          break;
        case "this-week":
          matchesDate = isAfter(event.rawDate, today) && 
                        isBefore(event.rawDate, nextWeekStart);
          break;
        case "this-weekend":
          matchesDate = isAfter(event.rawDate, thisWeekendStart) && 
                        isBefore(event.rawDate, thisWeekendEnd);
          break;
        case "next-week":
          matchesDate = isAfter(event.rawDate, nextWeekStart) && 
                        isBefore(event.rawDate, addDays(nextWeekStart, 7));
          break;
        case "next-month":
          matchesDate = isAfter(event.rawDate, today) && 
                        isBefore(event.rawDate, nextMonthStart);
          break;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  // Function to create column arrays for masonry layout
  const createMasonryColumns = (items, columnCount) => {
    const columns = Array.from({ length: columnCount }, () => []);
    
    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(item);
    });
    
    return columns;
  };

  // Create columns for different screen sizes
  const mobileColumns = createMasonryColumns(filteredEvents, 1);
  const tabletColumns = createMasonryColumns(filteredEvents, 2);
  const desktopColumns = createMasonryColumns(filteredEvents, 3);

  return (
    <div className="min-h-screen bg-[#E9E3D7]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Upcoming Events</h1>
          
          <Link href="/submit-event" className="bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-3 rounded-md font-medium">
            Submit an Event
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search bar */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-white focus:ring-[#4285F4] focus:border-[#4285F4]"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Event type filter */}
          <div className="w-full md:w-1/3">
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-[#4285F4] focus:border-[#4285F4] block w-full p-4"
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
          
          {/* Date filter */}
          <div className="w-full md:w-1/3">
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-[#4285F4] focus:border-[#4285F4] block w-full p-4"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {DATE_FILTERS.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedType !== "all" && (
            <div className="bg-[#4285F4] text-white px-3 py-1 rounded-full text-sm flex items-center">
              {EVENT_TYPES.find(t => t.value === selectedType)?.label}
              <button 
                onClick={() => setSelectedType("all")} 
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </div>
          )}
          
          {selectedDate !== "all" && (
            <div className="bg-[#4285F4] text-white px-3 py-1 rounded-full text-sm flex items-center">
              {DATE_FILTERS.find(d => d.value === selectedDate)?.label}
              <button 
                onClick={() => setSelectedDate("all")} 
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </div>
          )}
          
          {search && (
            <div className="bg-[#4285F4] text-white px-3 py-1 rounded-full text-sm flex items-center">
              Search: {search}
              <button 
                onClick={() => setSearch("")} 
                className="ml-2 hover:text-gray-200"
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4285F4]"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* No events found */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for more events.
            </p>
          </div>
        )}
        
        {/* Mobile layout (1 column) */}
        <div className="lg:hidden md:hidden block">
          <div className="flex flex-col gap-6">
            {mobileColumns[0].map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
        
        {/* Tablet layout (2 columns) */}
        <div className="hidden md:block lg:hidden">
          <div className="flex gap-6">
            {tabletColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-1 flex flex-col gap-6">
                {column.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop layout (3 columns) */}
        <div className="hidden lg:block">
          <div className="flex gap-6">
            {desktopColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-1 flex flex-col gap-6">
                {column.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// Extracted EventCard component for reuse
function EventCard({ event }) {
  return (
    <div className="bg-black text-white rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-1">
      {/* Image container */}
      <div className="w-full">
        {event.imageUrl ? (
          <div className="relative">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.appendChild(
                  document.createElement('div')
                ).outerHTML = '<div class="w-full h-64 bg-gray-900 flex items-center justify-center"><svg class="w-12 h-12 text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 0 486.1 0 456.1L0 456.1z"/></svg></div>';
              }}
            />
            
            {/* Circular pattern overlay - subtle pattern only */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-10" 
                   style={{
                     backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0) 1px, rgba(255,255,255,0.1) 1px)',
                     backgroundSize: '10px 10px'
                   }}>
              </div>
            </div>
            
            {/* Price tag */}
            <div className="absolute top-3 right-3">
              <span className="bg-white text-gray-800 text-xs font-medium px-2.5 py-1 rounded-md shadow-sm">
                {event.price}
              </span>
              {event.status === 'pending' && (
                <span className="ml-1 bg-yellow-800 text-yellow-200 text-xs font-medium px-2.5 py-1 rounded-md">
                  Pending
                </span>
              )}
            </div>
            
            {/* Date badge */}
            <div className="absolute top-3 left-3 text-right bg-black bg-opacity-70 px-2 py-1 rounded">
              <div className="text-xs font-medium uppercase text-white">{event.dayOfWeek}</div>
              <div className="text-xl font-bold text-white">{event.dayOfMonth}</div>
            </div>
          </div>
        ) : (
          <PlaceholderImage />
        )}
      </div>
      
      {/* Event details - now includes title and full description (up to 5 lines) */}
      <div className="p-5">
        {/* Title and description moved from overlay to bottom section */}
        <h3 className="font-bold text-2xl text-white mb-2 leading-tight">{event.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-5">{event.description}</p>
        
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <a 
            href={event.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-gray-300 hover:text-[#4285F4] transition-colors underline"
          >
            {event.location}
          </a>
        </div>
        
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
          </svg>
          <span className="text-sm text-gray-300">{event.shortDate}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-300">
              {event.eventTypeWithEmoji}
            </span>
          </div>
          <Link 
            href={`/events/${event.slug}`} 
            className="text-[#4285F4] hover:text-white text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}