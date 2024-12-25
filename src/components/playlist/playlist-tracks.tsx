"use client";

import { Play, Pause, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSpotify } from "@/lib/hooks/useSpotify";
import { usePlayerStore } from "@/lib/store/player-store";
import { formatDuration } from "@/lib/utils";
import { SpotifyTrack } from "@/lib/types/spotify";
import { toast } from "sonner";

export function PlaylistTracks() {
  const { tracks } = useSpotify();
  const { currentTrack, isPlaying, setIsPlaying, playQueue } = usePlayerStore();

  const handlePlayTrack = (track: SpotifyTrack, index: number) => {
    try {
      // If it's the current track, just toggle play/pause
      if (currentTrack?.id === track.id) {
        setIsPlaying(!isPlaying);
        return;
      }

      // Check if the track has a preview URL
      if (!track.preview_url) {
        toast.error("Preview not available for this track");
        return;
      }

      // Play the queue starting from this track
      playQueue(tracks.slice(index));
    } catch (error) {
      console.error("Error playing track:", error);
      toast.error("Failed to play track");
    }
  };

  if (!tracks?.length) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 font-medium text-muted-foreground">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Duration</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;

          return (
            <div
              key={track.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 hover:bg-accent/50 group"
            >
              <div className="w-8 text-center text-muted-foreground">
                <div className="relative group-hover:hidden">
                  {index + 1}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden group-hover:inline-flex absolute -translate-x-1/2"
                  onClick={() => handlePlayTrack(track, index)}
                  disabled={!track.preview_url}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium">
                  {track.name}
                </span>
                <span className="text-sm text-muted-foreground truncate">
                  {track.artists.map(a => a.name).join(", ")}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {track.album.name}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatDuration(track.duration_ms)}
                </span>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
