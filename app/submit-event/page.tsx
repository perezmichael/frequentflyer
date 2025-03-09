"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// Event types with emojis
const EVENT_TYPES = [
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

// Mapbox access token - using your token directly
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibWlrZXBlcmV6ZGlnaXRhbCIsImEiOiJjbTd0eDJvOW4xemZpMmtvaG5sa21xbWRrIn0.1wE2ylfT_NeCTKY_IKDlnA";

// Storage bucket name - must be created manually in Supabase dashboard
const STORAGE_BUCKET = "event-images";

// Function to search addresses using Mapbox Geocoding API
const searchAddresses = async (query: string) => {
  if (!query || query.length < 3) return [];
  
  try {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
    const params = new URLSearchParams({
      access_token: MAPBOX_ACCESS_TOKEN,
      types: 'address,place',
      country: 'US', // Limit to US addresses, remove or change for international
      limit: '5'     // Number of results to return
    });
    
    const response = await fetch(`${endpoint}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch address suggestions');
    }
    
    const data = await response.json();
    
    // Format the results
    return data.features.map(feature => ({
      id: feature.id,
      address: feature.place_name,
      coordinates: feature.geometry.coordinates // [longitude, latitude]
    }));
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
};

// Function to create a URL-friendly slug from a title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .trim();
};

export default function SubmitEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    coordinates: null as [number, number] | null, // [longitude, latitude]
    price: '',
    eventType: '',
    image: null as File | null,
    imagePreview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Address search state
  const [addressQuery, setAddressQuery] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const addressRef = useRef(null);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin?redirect=/submit-event');
    }
  }, [loading, user, router]);

  // Handle clicks outside the address suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressRef.current && !addressRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressRef]);

  // Search for addresses when query changes
  useEffect(() => {
    const fetchAddresses = async () => {
      if (addressQuery.length >= 3) {
        setIsLoadingAddresses(true);
        const results = await searchAddresses(addressQuery);
        setAddressSuggestions(results);
        setShowSuggestions(true);
        setIsLoadingAddresses(false);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    };
    
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(fetchAddresses, 300);
    return () => clearTimeout(timeoutId);
  }, [addressQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressQuery(e.target.value);
    setFormData(prev => ({ ...prev, location: e.target.value }));
  };

  const handleAddressSelect = (suggestion) => {
    setAddressQuery(suggestion.address);
    setFormData(prev => ({
      ...prev,
      location: suggestion.address,
      coordinates: suggestion.coordinates
    }));
    setShowSuggestions(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit an event');
      return;
    }
    
    if (!formData.title || !formData.date || !formData.location || !formData.eventType) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}-${createSlug(formData.title)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, formData.image);
        
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }
      
      // Format coordinates for PostGIS
      let coordinatesValue = null;
      if (formData.coordinates) {
        // For PostGIS, we need to use ST_MakePoint(longitude, latitude)
        // The format is POINT(longitude latitude)
        const [longitude, latitude] = formData.coordinates;
        coordinatesValue = `POINT(${longitude} ${latitude})`;
      }
      
      // Create event in database
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            date: formData.date + (formData.time ? `T${formData.time}:00` : 'T00:00:00'),
            location: formData.location,
            coordinates: coordinatesValue,
            price: formData.price,
            image_url: imageUrl,
            event_type: formData.eventType,
            slug: createSlug(formData.title),
            user_id: user.id,
            status: 'pending' // Default status
          }
        ])
        .select();
      
      if (error) {
        throw new Error(`Error saving event: ${error.message}`);
      }
      
      // Success!
      setSuccess('Event submitted successfully! It will be reviewed before appearing on the site.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        coordinates: null,
        price: '',
        eventType: '',
        image: null,
        imagePreview: ''
      });
      setAddressQuery('');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/events');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting event:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Submit an Event</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="eventType" className="block text-gray-700 font-medium mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your event"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6" ref={addressRef}>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={addressQuery}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for an address"
                  required
                  autoComplete="off"
                />
                {isLoadingAddresses && (
                  <div className="absolute right-3 top-3">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {addressSuggestions.map(suggestion => (
                      <div
                        key={suggestion.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        {suggestion.address}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formData.coordinates && (
                <p className="text-sm text-gray-500 mt-1">
                  Coordinates: {formData.coordinates[1].toFixed(6)}, {formData.coordinates[0].toFixed(6)}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Free, $10, $25-50, etc."
              />
            </div>

            <div className="mb-8">
              <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                Event Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed hover:bg-gray-50 hover:border-gray-300 rounded-lg">
                  <div className="flex flex-col items-center justify-center pt-7">
                    {formData.imagePreview ? (
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                          Upload event image
                        </p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="image" 
                    name="image"
                    accept="image/*"
                    className="opacity-0" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}