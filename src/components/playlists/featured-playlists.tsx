import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredPlaylists = [
  {
    id: 1,
    title: "Today's Top Hits",
    description: "The biggest hits right now",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    tracks: 50,
  },
  {
    id: 2,
    title: "Discover Weekly",
    description: "Your personal mixtape of fresh music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    tracks: 30,
  },
  {
    id: 3,
    title: "Release Radar",
    description: "Catch all the latest music from artists you follow",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    tracks: 40,
  },
  // Add more featured playlists as needed
];

export function FeaturedPlaylists() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Featured Playlists</h2>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {featuredPlaylists.map((playlist) => (
            <Card
              key={playlist.id}
              className="group relative w-[300px] overflow-hidden"
            >
              <div className="aspect-square relative">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" className="rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {playlist.description}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {playlist.tracks} tracks
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