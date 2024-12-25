"use client";

import { Artist } from "@/app/actions/get-artists";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/player-store";
import { Play, Pause, Plus, Heart } from "lucide-react";
import { useState } from "react";
import { AddToPlaylistDialog } from "../tracks/add-to-playlist-dialog";
import { useFavoritesStore } from "@/lib/store/favorites-store";

interface ArtistTracksProps {
  artist: Artist;
}

export function ArtistTracks({ artist }: ArtistTracksProps) {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    playQueue,
    togglePlay
  } = usePlayerStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  if (!artist.tracks || artist.tracks.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No tracks available.
      </div>
    );
  }

  // Add metadata to all tracks
  const tracksWithMeta = artist.tracks.map(track => ({
    ...track,
    artist: artist.name,
    image: artist.image
  }));

  const handleTogglePlay = (trackIndex: number) => {
    if (currentTrack?.id === tracksWithMeta[trackIndex].id) {
      togglePlay();
    } else {
      // When playing a track, set all artist tracks as the queue
      playQueue(tracksWithMeta);
      // Then play the selected track
      playTrack(tracksWithMeta[trackIndex]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {tracksWithMeta.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;

        return (
          <div
            key={track.id}
            className="flex items-center justify-between p-3 hover:bg-neutral-800/50 rounded-md group"
          >
            <div className="flex items-center gap-x-3">
              <Button
                className="opacity-0 group-hover:opacity-100 transition"
                variant="ghost"
                size="sm"
                onClick={() => handleTogglePlay(index)}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div>
                <p className={`text-white ${isCurrentTrack ? 'text-green-500' : ''}`}>
                  {track.title}
                </p>
                <p className="text-sm text-neutral-400">{track.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                className="opacity-0 group-hover:opacity-100 transition"
                variant="ghost"
                size="sm"
                onClick={() => 
                  isFavorite(track.id) 
                    ? removeFavorite(track.id)
                    : addFavorite(track)
                }
              >
                <Heart className={`h-4 w-4 ${isFavorite(track.id) ? "fill-current text-green-500" : ""}`} />
              </Button>
              <Button
                className="opacity-0 group-hover:opacity-100 transition"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTrack(track.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <AddToPlaylistDialog 
                track={track}
                open={selectedTrack === track.id}
                onOpenChange={(open) => {
                  if (!open) setSelectedTrack(null);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}