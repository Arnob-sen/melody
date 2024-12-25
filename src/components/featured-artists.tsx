"use client";

import { Card } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useRouter } from "next/navigation";
import { Artist } from "@/app/actions/get-artists";

interface FeaturedArtistsProps {
  artists: Artist[];
}

export function FeaturedArtists({ artists }: FeaturedArtistsProps) {
  const router = useRouter();
  const handleArtistClick = (artist: Artist) => {
    if (artist?.id) {
      router.push(`/artists/${encodeURIComponent(artist.id)}`);
    }
  };


  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Featured Artists</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {artists.map((artist) => (
            <Card
              key={artist.id}
              className="group cursor-pointer overflow-hidden p-3 transition-colors hover:bg-muted/50"
              onClick={() => handleArtistClick(artist)}
            >
              <div className="aspect-square w-[120px] sm:w-[150px] overflow-hidden rounded-full">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-3 text-center">
                <h3 className="font-medium text-sm sm:text-base">{artist.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[150px]">{artist.genres.join(", ")}</p>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}