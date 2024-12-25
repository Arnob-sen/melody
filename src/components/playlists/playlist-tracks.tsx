"use client";

import { Playlist, removeTrackFromPlaylist } from "@/app/actions/get-playlists";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/player-store";
import { Play, Pause, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PlaylistTracksProps {
  playlist: Playlist;
}

export function PlaylistTracks({ playlist }: PlaylistTracksProps) {
  const router = useRouter();
  const { 
    currentTrack, 
    isPlaying,
    playTrack,
    playQueue,
    togglePlay
  } = usePlayerStore();

  const handlePlay = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // When playing a track from playlist, set all playlist tracks as the queue
      playQueue(playlist.tracks);
      // Find the index of the track in playlist
      const trackIndex = playlist.tracks.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        // Play from that position in the queue
        playTrack(track);
      }
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    try {
      const success = await removeTrackFromPlaylist(playlist.id, trackId);
      if (success) {
        toast.success("Track removed from playlist");
        router.refresh();
      } else {
        toast.error("Failed to remove track");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (!playlist.tracks || playlist.tracks.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No tracks in this playlist.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {playlist.tracks.map((track) => {
        const isCurrentTrack = currentTrack?.id === track.id;

        return (
          <div
            key={track.id}
            className="flex items-center justify-between p-2 hover:bg-neutral-800/50 rounded-md group"
          >
            <div className="flex items-center gap-x-3">
              <div className="relative min-h-[48px] min-w-[48px] overflow-hidden rounded-md">
                <Image
                  fill
                  src={track.image}
                  alt={track.title}
                  className="object-cover"
                />
              </div>
              <Button
                className="opacity-0 group-hover:opacity-100 transition"
                variant="ghost"
                size="sm"
                onClick={() => handlePlay(track)}
              >
                {isCurrentTrack && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="flex flex-col">
                <p className={`font-semibold truncate ${isCurrentTrack ? 'text-green-500' : ''}`}>
                  {track.title}
                </p>
                <p className="text-neutral-400 text-sm truncate">
                  {track.artist}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <span className="text-neutral-400 text-sm">
                {track.duration}
              </span>
              <Button
                onClick={() => handleRemoveTrack(track.id)}
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
