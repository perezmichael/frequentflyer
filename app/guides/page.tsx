"use client";

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import PlaceholderImage from '../../components/PlaceholderImage';

// Sample guides data with Unsplash images
const guidesData = [
  {
    id: 1,
    title: "Coffee Shop Guide",
    description: "Discover the best coffee shops in LA with our comprehensive guide.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    slug: "coffee-shop-guide"
  },
  {
    id: 2,
    title: "Rooftop Bars Guide",
    description: "Explore the most stunning rooftop bars with breathtaking views.",
    image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    slug: "rooftop-bars-guide"
  },
  {
    id: 3,
    title: "Hidden Gems Guide",
    description: "Uncover secret spots and hidden gems that locals love.",
    image: "https://images.unsplash.com/photo-1518992094158-6f27bd36777f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    slug: "hidden-gems-guide"
  },
  {
    id: 4,
    title: "Weekend Getaways Guide",
    description: "Perfect weekend escapes within driving distance.",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    slug: "weekend-getaways-guide"
  }
];

export default function GuidesPage() {
  const [search, setSearch] = useState("");

  const filteredGuides = guidesData.filter(guide => 
    guide.title.toLowerCase().includes(search.toLowerCase()) ||
    guide.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSearch={setSearch} />
      
      <main className="container mx-auto pt-32 px-4 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Guides</h1>
          <p className="text-gray-600 text-lg">
            Curated guides to help you discover the best experiences in your city.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map(guide => (
            <Link href={`/guides/${guide.slug}`} key={guide.id}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
                <div className="w-full h-48 overflow-hidden">
                  {guide.image ? (
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
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
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{guide.title}</h3>
                  <p className="text-gray-600">{guide.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">No guides found matching your search.</h3>
          </div>
        )}
      </main>
    </div>
  );
} 