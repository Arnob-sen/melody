"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArtistCard } from "./artist-card";

const topArtists = [
  {
    id: 1,
    name: "Bad Bunny",
    image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400&q=80",
    followers: "58.1M",
    featured: true
  },
  {
    id: 2,
    name: "Beyoncé",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    followers: "55.3M",
    featured: true
  },
  {
    id: 3,
    name: "Ed Sheeran",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
    followers: "52.8M",
    featured: true
  }
];

export function TopArtists() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Featured Artists</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {topArtists.map((artist) => (
            <div key={artist.id} className="w-[250px]">
              <ArtistCard {...artist} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}