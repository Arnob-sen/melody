"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSpotify } from "@/lib/hooks/useSpotify";
import { usePlayerStore } from "@/lib/store/player-store";
import { toast } from "sonner";

export function PlaylistHeader() {
  const { playlist, tracks } = useSpotify();
  const { isPlaying, setIsPlaying, currentTrack, playQueue } = usePlayerStore();

  const handlePlayAll = () => {
    try {
      // If already playing from this playlist, just toggle play/pause
      if (tracks.some(track => track.id === currentTrack?.id)) {
        setIsPlaying(!isPlaying);
        return;
      }

      // Filter tracks that have preview URLs
      const playableTracks = tracks.filter(track => track.preview_url);
      
      if (playableTracks.length === 0) {
        toast.error("No playable tracks found in this playlist");
        return;
      }

      // Play all tracks that have preview URLs
      playQueue(playableTracks);
    } catch (error) {
      console.error("Error playing playlist:", error);
      toast.error("Failed to play playlist");
    }
  };

  if (!playlist) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative aspect-square h-48 w-48 overflow-hidden rounded-md">
          {playlist.images?.[0]?.url && (
            <Image
              src={playlist.images[0].url}
              alt={playlist.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-end">
          <div className="text-sm font-medium uppercase text-muted-foreground">
            Playlist
          </div>
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-muted-foreground">{playlist.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full"
              onClick={handlePlayAll}
            >
              {isPlaying && tracks.some(track => track.id === currentTrack?.id) ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              {playlist.tracks.total} tracks
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
