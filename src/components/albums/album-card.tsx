"use client";

import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Album {
  id: string;
  title: string;
  artist: string;
  image: string;
  releaseDate: string;
}

interface AlbumCardProps {
  album: Album;
  onPlay?: () => void;
}

export function AlbumCard({ album, onPlay }: AlbumCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={album.image}
          alt={album.title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="icon" className="rounded-full" onClick={onPlay}>
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{album.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{album.artist}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date(album.releaseDate).getFullYear()}
        </p>
      </div>
    </Card>
  );
}
