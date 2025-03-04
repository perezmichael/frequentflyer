import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Restaurant {
  id: number;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
}

interface MapProps {
  restaurants: Restaurant[];
}

mapboxgl.accessToken = "pk.eyJ1IjoibWlrZXBlcmV6ZGlnaXRhbCIsImEiOiJjbTd0eDJvOW4xemZpMmtvaG5sa21xbWRrIn0.1wE2ylfT_NeCTKY_IKDlnA";
console.log("Mapbox Token:", mapboxgl.accessToken);

export default function Map({ restaurants }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      console.log("Map container not found!");
      return;
    }
    console.log("Initializing map...");

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-118.2437, 34.0522], // LA default
      zoom: 12,
    });

    restaurants.forEach((restaurant) => {
      console.log("Adding marker:", restaurant.name);
      new mapboxgl.Marker()
        .setLngLat([restaurant.lng, restaurant.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${restaurant.name}</h3><p>Rating: ${restaurant.rating || "N/A"}</p>`
          )
        )
        .addTo(map.current!);
    });

    return () => map.current?.remove();
  }, [restaurants]);

  return (
    <div>
      <div 
        ref={mapContainer} 
        className="h-96 w-full rounded bg-gray-200" 
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
}