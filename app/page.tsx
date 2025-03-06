"use client";

import { useState, useEffect } from "react";
import Map from "../components/Map";

async function getCoffeeShops() {
  const res = await fetch("/api/coffee-shops", {
    cache: "no-store", // Disable caching to see fresh data
  });
  if (!res.ok) {
    throw new Error("Failed to fetch coffee shops");
  }
  const data = await res.json();
  console.log("Fetched data:", data);
  return data;
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
  const [search, setSearch] = useState("");
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);

  useEffect(() => {
    getCoffeeShops()
      .then((data) => setCoffeeShops(data))
      .catch((e) => console.error("Error fetching coffee shops:", e));
  }, []);

  if (!coffeeShops || coffeeShops.length === 0) {
    return <div>No coffee shops found</div>;
  }

  const filteredCoffeeShops = coffeeShops.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const restaurants = mapCoffeeShopsToRestaurants(filteredCoffeeShops);

  console.log("Rendering with coffee shops:", coffeeShops);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 p-4 shadow fixed top-0 w-full z-10">
        <h1 className="text-white text-4xl font-bold animate-pulse">Coffee Shop Guide</h1>
        <input
          type="text"
          placeholder="Search coffee shops..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full p-2 border rounded"
        />
      </header>

      <main className="mt-32">
        <div className="flex">
          <div className="w-1/2 h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="p-4">
              <ul className="space-y-6">
                {filteredCoffeeShops.map((coffeeShop) => (
                  <li
                    key={coffeeShop.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={coffeeShop.image}
                        alt={coffeeShop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-2">{coffeeShop.name}</h3>
                      <p className="text-gray-600">
                        {coffeeShop.cuisine} • Rating: {coffeeShop.rating || "N/A"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-1/2 fixed right-0 top-32 bottom-0 pr-4">
            <Map restaurants={restaurants} />
          </div>
        </div>
      </main>
    </div>
  );
}