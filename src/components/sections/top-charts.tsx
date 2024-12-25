"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { usePlayerStore } from "@/lib/store/player-store";

export function TopCharts() {
  const { favorites } = useFavoritesStore();
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayerStore();

  const handlePlay = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // When playing a track from favorites, set all favorites as the queue
      playQueue(favorites);
      // Find the index of the track in favorites
      const trackIndex = favorites.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        // Play from that position in the queue
        playTrack(track);
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          Your Favorites
        </div>
      </h2>
      <div className="space-y-4">
        {favorites.slice(0, 5).map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 group hover:bg-accent/50 p-2 rounded-md"
          >
            <span className="w-6 text-center text-muted-foreground">{index + 1}</span>
            <div className="w-12 h-12 rounded-md overflow-hidden">
              <img
                src={track.image}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{track.title}</h3>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
            <div className="text-sm text-muted-foreground">{track.duration}</div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition"
              onClick={() => handlePlay(track)}
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}