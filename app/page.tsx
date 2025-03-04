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
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Coffee Shop Guide</h1>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full p-2 border rounded"
        />
      </header>

      <main className="p-4">
  <section className="grid md:grid-cols-2 gap-4 min-h-[500px]">
    <div>
      <h2 className="text-xl font-semibold mb-2">Top Picks</h2>
      <ul className="space-y-2">
        {filteredRestaurants.map((restaurant) => (
          <li key={restaurant.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
            <p>{restaurant.cuisine} • Rating: {restaurant.rating || "N/A"}</p>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="h-full w-full">
      <Map restaurants={filteredRestaurants} />
    </div>
  </section>
</main>
    </div>
  );
}