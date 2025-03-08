"use client";

import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import Map from '../components/Map';
import SignUp from '../../components/SignUp';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

async function getCoffeeShops() {
  try {
    const res = await fetch("/api/coffee-shops");
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch coffee shops");
    }
    
    return res.json();
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    throw error;
  }
}

interface CoffeeShop {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating?: number; // Optional property
  lat?: number; // Optional latitude
  lng?: number; // Optional longitude
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  cuisine: string;
  rating?: number; // Optional property
  lat: number; // Add latitude property
  lng: number; // Add longitude property
}

const mapCoffeeShopsToRestaurants = (coffeeShops: CoffeeShop[]): Restaurant[] => {
  return coffeeShops.map(coffeeShop => ({
    id: coffeeShop.id,
    name: coffeeShop.name,
    image: coffeeShop.image,
    cuisine: coffeeShop.cuisine,
    rating: coffeeShop.rating,
    lat: coffeeShop.lat || 0, // Replace with actual lat value
    lng: coffeeShop.lng || 0  // Replace with actual lng value
  }));
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="container mx-auto pt-24 px-4">
        {authLoading ? (
          <p className="text-center">Loading authentication...</p>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Coffee Shop Guide</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search coffee shops..."
                  className="px-4 py-2 border rounded-full w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="text-center">Loading coffee shops...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="flex">
                <div className="w-1/2 pr-4">
                  {filteredCoffeeShops.length === 0 ? (
                    <p className="text-center">No coffee shops found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {filteredCoffeeShops.map((coffeeShop) => (
                        <li
                          key={coffeeShop.id}
                          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                          <div className="w-full h-48 overflow-hidden">
                            <img
                              src={coffeeShop.image || "/placeholder.jpg"}
                              alt={coffeeShop.name || "Coffee Shop"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.jpg";
                              }}
                            />
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

                <div className="w-1/2 fixed right-0 top-32 bottom-0 pr-4">
                  <Map restaurants={restaurants} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}