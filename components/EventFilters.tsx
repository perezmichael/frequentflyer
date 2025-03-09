import { useState } from 'react';

// Event types with emojis
const EVENT_TYPES = [
  { value: "", label: "All Events" },
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

export default function EventFilters({ filters, onFilterChange }) {
  const [searchInput, setSearchInput] = useState(filters.searchQuery || '');
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ searchQuery: searchInput });
  };
  
  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({ eventType: '', date: '', searchQuery: '' });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Event Type Filter */}
        <div>
          <select
            value={filters.eventType}
            onChange={(e) => onFilterChange({ eventType: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {EVENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange({ date: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Clear Filters Button */}
      {(filters.eventType || filters.date || filters.searchQuery) && (
        <div className="mt-4 text-right">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
} 