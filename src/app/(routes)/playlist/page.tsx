"use client";

import { useSpotify } from "@/lib/hooks/useSpotify";
import { PlaylistHeader } from "@/components/playlist/playlist-header";
import { PlaylistTracks } from "@/components/playlist/playlist-tracks";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaylistPage() {
  const { loading, error, getPlaylistDetails, getPlaylistTracks, playlist } = useSpotify();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading playlist: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PlaylistHeader />
      <PlaylistTracks />
    </div>
  );
}
