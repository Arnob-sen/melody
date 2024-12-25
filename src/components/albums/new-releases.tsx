"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const newReleases = [
  {
    id: 1,
    title: "Midnights",
    artist: "Taylor Swift",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
    releaseDate: "New Release"
  },
  {
    id: 2,
    title: "SOS",
    artist: "SZA",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    releaseDate: "New Release"
  },
  {
    id: 3,
    title: "Un Verano Sin Ti",
    artist: "Bad Bunny",
    image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=400&q=80",
    releaseDate: "New Release"
  }
];

export function NewReleases() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">New Releases</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {newReleases.map((album) => (
            <Card
              key={album.id}
              className="group relative w-[250px] overflow-hidden"
            >
              <div className="aspect-square relative">
                <img
                  src={album.image}
                  alt={album.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" className="rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs mb-2">
                  {album.releaseDate}
                </div>
                <h3 className="font-semibold truncate">{album.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {album.artist}
                </p>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}