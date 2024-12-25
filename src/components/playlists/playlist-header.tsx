"use client";

import { Playlist } from "@/app/actions/get-playlists";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/player-store";
import { Play, Pause, Edit } from "lucide-react";
import { useState } from "react";
import { EditPlaylistDialog } from "./edit-playlist-dialog";

interface PlaylistHeaderProps {
  playlist: Playlist;
}

export function PlaylistHeader({ playlist }: PlaylistHeaderProps) {
  const { currentTrack, isPlaying, setIsPlaying, playTrack } = usePlayerStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handlePlay = () => {
    if (playlist.tracks.length === 0) return;

    const firstTrack = playlist.tracks[0];
    if (currentTrack?.path === firstTrack.path) {
      setIsPlaying(!isPlaying);
    } else {
      playTrack(firstTrack);
    }
  };

  return (
    <div className="relative flex items-center gap-x-6 p-6">
      <div className="relative h-32 w-32 lg:h-44 lg:w-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={playlist.image || '/images/playlist-default.png'}
          alt="Playlist"
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/playlist-default.png';
          }}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-white text-4xl font-bold">
          {playlist.name}
        </h1>
        <p className="text-neutral-400">
          {playlist.description}
        </p>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={handlePlay}
            size="lg"
            className="w-[140px]"
            disabled={playlist.tracks.length === 0}
          >
            {isPlaying && currentTrack?.path === playlist.tracks[0]?.path ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span className="ml-2">
              {playlist.tracks.length === 0 ? "No tracks" : "Play"}
            </span>
          </Button>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            variant="outline"
            size="lg"
          >
            <Edit className="h-5 w-5" />
            <span className="ml-2">Edit</span>
          </Button>
        </div>
      </div>
      <EditPlaylistDialog
        playlist={playlist}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
}
