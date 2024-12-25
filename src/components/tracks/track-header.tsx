"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotifyTrack } from "@/lib/types/spotify";

interface TrackHeaderProps {
  onPlayAll?: (tracks: SpotifyTrack[]) => void;
  tracks: SpotifyTrack[];
}

export function TrackHeader({ onPlayAll, tracks }: TrackHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Tracks</h1>
      <Button onClick={() => onPlayAll?.(tracks)}>
        <Play className="mr-2 h-4 w-4" />
        Play All
      </Button>
    </div>
  );
}