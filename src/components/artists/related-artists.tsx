"use client";

import { Card } from "../ui/card";

const dummyRelatedArtists = [
  {
    id: 1,
    name: "Drake",
    image: "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&q=80",
  },
  {
    id: 2,
    name: "Post Malone",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  },
  {
    id: 3,
    name: "Travis Scott",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  },
  {
    id: 4,
    name: "Kendrick Lamar",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  },
];

export function RelatedArtists() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Fans Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dummyRelatedArtists.map((artist) => (
          <Card
            key={artist.id}
            className="group cursor-pointer overflow-hidden"
          >
            <div className="aspect-square relative">
              <img
                src={artist.image}
                alt={artist.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{artist.name}</h3>
              <p className="text-sm text-muted-foreground">Artist</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
