"use client";

import { Card } from "@/components/ui/card";
import { Play, Pause, Heart, MoreHorizontal, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotifyTrack } from "@/lib/types/spotify";
import { usePlayerStore } from "@/lib/store/player-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddToPlaylistButton } from "@/components/add-to-playlist-button";
import { PlayButton } from "@/components/sections/play-button";

interface TrackListProps {
  tracks: SpotifyTrack[];
}

type SortOption = "name" | "artist" | "album" | "duration";

export function TrackList({ tracks: initialTracks }: TrackListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 10;

  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sortTracks = (tracks: SpotifyTrack[], sortBy: SortOption) => {
    return [...tracks].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "artist":
          return a.artists[0].name.localeCompare(b.artists[0].name);
        case "album":
          return a.album.name.localeCompare(b.album.name);
        case "duration":
          return a.duration_ms - b.duration_ms;
        default:
          return 0;
      }
    });
  };

  const sortedTracks = sortTracks(initialTracks, sortBy);
  const totalPages = Math.ceil(sortedTracks.length / tracksPerPage);
  const currentTracks = sortedTracks.slice(
    (currentPage - 1) * tracksPerPage,
    currentPage * tracksPerPage
  );

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const handleLike = (track: SpotifyTrack) => {
    if (isFavorite(track.id)) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  };

  const handlePlay = (index: number) => {
    const track = currentTracks[index];
    const trackWithMeta = {
      ...track,
      image: track.album.images[0]?.url || "/images/music-placeholder.png",
      artist: track.artists.map(artist => artist.name).join(", "),
    };

    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(trackWithMeta);
      setIsPlaying(true);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
            <SelectItem value="album">Album</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border-b pb-4 mb-4">
        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 text-sm text-muted-foreground">
          <div>#</div>
          <div>TITLE</div>
          <div>ALBUM</div>
          <Clock3 className="h-4 w-4" />
          <div></div>
        </div>
      </div>

      <div className="space-y-2">
        {currentTracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const trackWithMeta = {
            ...track,
            image: track.album.images[0]?.url || "/images/music-placeholder.png",
            artist: track.artists.map(artist => artist.name).join(", "),
          };

          return (
            <div
              key={track.id}
              className="flex items-center gap-x-4 w-full hover:bg-primary/10 transition p-2 rounded-md group"
            >
              <div className="relative min-h-[48px] min-w-[48px] overflow-hidden rounded-md">
                <img
                  src={trackWithMeta.image}
                  alt={track.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between w-full gap-x-4">
                <div className="flex flex-col gap-y-1">
                  <p className={`truncate ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
                    {track.name}
                  </p>
                  <p className="text-neutral-400 text-sm truncate">
                    {trackWithMeta.artist}
                  </p>
                </div>
                <div className="flex items-center gap-x-4 text-neutral-400">
                  <p className="text-neutral-400 text-sm">
                    {formatDuration(track.duration_ms)}
                  </p>
                  <div className="flex items-center gap-x-2">
                    <AddToPlaylistButton song={trackWithMeta} />
                    <PlayButton onClick={() => handlePlay(index)}>
                      {isCurrentTrack && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </PlayButton>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleLike(track)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${isFavorite(track.id) ? "fill-current text-red-500" : ""}`} 
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}