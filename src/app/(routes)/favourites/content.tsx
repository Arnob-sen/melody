"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Pause, Play } from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";

export function DownloadsContent() {
  const { currentTrack, isPlaying, playTrack, togglePlay, playQueue } = usePlayerStore();
  const { favorites, removeFavorite } = useFavoritesStore();

  const handlePlayTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // When playing a track, set all favorites as the queue
      playQueue(favorites);
      // Then play the selected track
      playTrack(track);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Heart className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Favorite Songs Yet</h2>
        <p className="text-gray-500">
          Add songs to your favorites from Artists, Albums, or Tracks
        </p>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        {favorites.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 rounded-lg hover:bg-primary/10 transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={track.image}
                alt={track.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <p className="font-medium">{track.title}</p>
                <p className="text-sm text-gray-500">{track.artist}</p>
              </div>
            </div>
            <div className="text-gray-500">
              {track.duration}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handlePlayTrack(track)}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFavorite(track.id)}
              >
                <Heart className="h-5 w-5 fill-current text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
