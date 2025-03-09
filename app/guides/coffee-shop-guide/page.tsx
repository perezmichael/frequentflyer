"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import Map from '../../../components/Map';
import PlaceholderImage from '../../../components/PlaceholderImage';

// Sample coffee shops data with Unsplash images
const sampleCoffeeShops = [
  {
    id: 1,
    name: "Verve Coffee Roasters",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    cuisine: "Coffee & Pastries",
    rating: 4.7,
    lat: 34.0522,
    lng: -118.2437
  },
  {
    id: 2,
    name: "Blue Bottle Coffee",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    cuisine: "Specialty Coffee",
    rating: 4.5,
    lat: 34.0610,
    lng: -118.2370
  },
  {
    id: 3,
    name: "Intelligentsia Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    cuisine: "Coffee & Breakfast",
    rating: 4.6,
    lat: 34.0505,
    lng: -118.2500
  },
  {
    id: 4,
    name: "Stumptown Coffee Roasters",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    cuisine: "Coffee & Light Bites",
    rating: 4.4,
    lat: 34.0480,
    lng: -118.2600
  }
];

async function getCoffeeShops() {
  // Normally this would fetch from an API, but for now we'll use sample data
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sampleCoffeeShops);
    }, 500);
  });
}

export default function CoffeeShopGuidePage() {
  const [search, setSearch] = useState("");
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getCoffeeShops()
      .then((data) => {
        setCoffeeShops(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching coffee shops:", e);
        setError("Failed to load coffee shops. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const filteredCoffeeShops = coffeeShops.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Map coffee shops to restaurants for the Map component
  const restaurants = filteredCoffeeShops.map(coffeeShop => ({
    id: coffeeShop.id,
    name: coffeeShop.name || "Unknown",
    image: coffeeShop.image || "",
    cuisine: coffeeShop.cuisine || "",
    rating: coffeeShop.rating || 0,
    lat: coffeeShop.lat || 0,
    lng: coffeeShop.lng || 0
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto pt-32 px-4 pb-12">
        <div className="mb-8">
          <Link href="/guides" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
            ← Back to Guides
          </Link>
          <h1 className="text-4xl font-bold mb-4">Coffee Shop Guide</h1>
          <p className="text-gray-600 text-lg">
            Discover the best coffee shops in LA with our comprehensive guide.
          </p>
        </div>

        {loading ? (
          <p className="text-center py-8">Loading coffee shops...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-8">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-8 md:mb-0">
              {filteredCoffeeShops.length === 0 ? (
                <p className="text-center py-8">No coffee shops found matching your search.</p>
              ) : (
                <ul className="space-y-4">
                  {filteredCoffeeShops.map((coffeeShop) => (
                    <li
                      key={coffeeShop.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="w-full h-48 overflow-hidden">
                        {coffeeShop.image ? (
                          <img
                            src={coffeeShop.image}
                            alt={coffeeShop.name || "Coffee Shop"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const placeholder = document.createElement('div');
                              placeholder.className = "w-full h-full";
                              const placeholderComponent = document.createElement('div');
                              placeholderComponent.className = "bg-gray-200 flex items-center justify-center w-full h-full";
                              placeholderComponent.innerHTML = `<svg class="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>`;
                              placeholder.appendChild(placeholderComponent);
                              e.currentTarget.parentElement.appendChild(placeholder);
                            }}
                          />
                        ) : (
                          <PlaceholderImage />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-xl mb-2">{coffeeShop.name || "Unknown"}</h3>
                        <p className="text-gray-600">
                          {coffeeShop.cuisine || "Coffee"} • Rating: {coffeeShop.rating || "N/A"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full md:w-1/2 md:sticky md:top-32 md:self-start h-[500px]">
              <Map restaurants={restaurants} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 