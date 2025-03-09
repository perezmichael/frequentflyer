"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { supabase } from '../../lib/supabase';
import mapboxgl from 'mapbox-gl';

// Set your Mapbox token here
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoibWlrZXBlcmV6ZGlnaXRhbCIsImEiOiJjbTd0eDJvOW4xemZpMmtvaG5sa21xbWRrIn0.1wE2ylfT_NeCTKY_IKDlnA";
mapboxgl.accessToken = MAPBOX_TOKEN;

// Storage bucket name - must be created manually in Supabase dashboard
const STORAGE_BUCKET = "event-images";

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

// Function to create a URL-friendly slug from a title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with a single hyphen
    .trim();
};

export default function SubmitEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const addressRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    coordinates: null,
    price: '',
    event_type: '',
    image: null,
    imagePreview: ''
  });

  // Handle clicks outside the address suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressRef.current && !addressRef.current.contains(event.target)) {
        setAddressSuggestions([]);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = async (e) => {
    const query = e.target.value;
    setSearchAddress(query);
    
    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_TOKEN}&country=us&types=address,place,poi&limit=5`
        );
        
        const data = await response.json();
        
        // Format the results
        const suggestions = data.features.map(feature => ({
          id: feature.id,
          address: feature.place_name,
          coordinates: feature.geometry.coordinates // [longitude, latitude]
        }));
        
        setAddressSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSelectAddress = (suggestion) => {
    setSearchAddress(suggestion.address);
    setFormData(prev => ({
      ...prev,
      location: suggestion.address,
      coordinates: suggestion.coordinates
    }));
    setAddressSuggestions([]);
  };

  const handleImageChange = (e) => {
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
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to submit an event');
        setIsLoading(false);
        return;
      }
      
      let imageUrl = '';
      
      // Upload image if provided
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}-${createSlug(formData.title)}.${fileExt}`;
        
        try {
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
        } catch (error) {
          console.error('Error uploading image:', error);
          // Continue without image if upload fails
        }
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
            event_type: formData.event_type,
            slug: createSlug(formData.title),
            user_id: session.user.id,
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
        event_type: '',
        image: null,
        imagePreview: ''
      });
      setSearchAddress('');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/events');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting event:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9e3d7]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
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
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a descriptive title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your event"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div ref={addressRef}>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchAddress"
                    value={searchAddress}
                    onChange={handleAddressSearch}
                    placeholder="Search for an address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                      {addressSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectAddress(suggestion)}
                        >
                          {suggestion.address}
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="hidden"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                  />
                </div>
                {formData.coordinates && (
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: {formData.coordinates[1].toFixed(6)}, {formData.coordinates[0].toFixed(6)}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (leave blank if free)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. $10, $5-15, Donation-based"
                />
              </div>
              
              <div>
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  id="event_type"
                  name="event_type"
                  required
                  value={formData.event_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an event type</option>
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
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
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 bg-[#181B22] text-white rounded-md hover:bg-[#181B22]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Submitting...' : 'Submit Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}