"use client";

import { useState } from "react";
import restaurants from "../data/restaurants.json";
import Map from "../components/Map";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 p-4 shadow fixed top-0 w-full z-10">
        <h1 className="text-white text-4xl font-bold animate-pulse">Coffee Shop Guide</h1>
        <input
          type="text"
          placeholder="Search restaurants..."
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
                {filteredRestaurants.map((restaurant) => (
                  <li 
                    key={restaurant.id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-2">{restaurant.name}</h3>
                      <p className="text-gray-600">{restaurant.cuisine} • Rating: {restaurant.rating || "N/A"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-1/2 fixed right-0 top-32 bottom-0 pr-4">
            <Map restaurants={filteredRestaurants} />
          </div>
        </div>
      </main>
    </div>
  );
}