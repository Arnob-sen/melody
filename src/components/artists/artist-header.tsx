"use client";

import { Artist } from "@/app/actions/get-artists";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/player-store";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

interface ArtistHeaderProps {
  artist: Artist;
}

export function ArtistHeader({ artist }: ArtistHeaderProps) {
  const { 
    playTrack,
    setIsPlaying
  } = usePlayerStore();

  const handlePlay = () => {
    if (artist.tracks && artist.tracks.length > 0) {
      const firstTrack = {
        ...artist.tracks[0],
        artist: artist.name,
        image: artist.image
      };
      playTrack(firstTrack);
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative h-[400px]">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-neutral-900 z-10" />
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src={artist.image}
          alt={artist.name}
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute bottom-0 left-0 p-8 z-20">
        <div className="flex items-center gap-x-2">
          <div className="text-white">
            <p className="text-sm font-semibold">Artist</p>
            <h1 className="text-4xl font-bold">{artist.name}</h1>
            <p className="text-sm mt-2">{artist.bio}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={handlePlay}
            className="bg-green-500 hover:bg-green-400"
            size="lg"
            disabled={!artist.tracks || artist.tracks.length === 0}
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}