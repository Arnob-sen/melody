'use client';

import { LocalTrack } from "@/app/actions/get-local-music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlayerStore } from "@/lib/store/player-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { Heart, Pause, Play, Search } from "lucide-react";
import { useState } from "react";
import { TrackMenu } from "@/components/tracks/track-menu";

interface TracksContentProps {
  tracks: (LocalTrack & { albumTitle: string; albumCover: string })[];
}

export default function TracksContent({ tracks }: TracksContentProps) {
  const [search, setSearch] = useState("");
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayerStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase()) ||
      track.albumTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlayTrack = (trackIndex: number) => {
    // When playing a track, set all filtered tracks as the queue
    playQueue(filteredTracks);
    // Then play the selected track
    playTrack(filteredTracks[trackIndex]);
  };

  const handleTogglePlay = (trackIndex: number) => {
    if (currentTrack?.id === filteredTracks[trackIndex].id) {
      togglePlay();
    } else {
      handlePlayTrack(trackIndex);
    }
  };

  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      playQueue(filteredTracks);
      playTrack(filteredTracks[0]);
    }
  };

  function formatTime(duration: string | number) {
    if (typeof duration === 'string') {
      return duration;
    }
    const minutes = Math.floor(duration / 60);
    const secondsRemaining = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">All Tracks</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tracks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <Button onClick={handlePlayAll}>
            Play All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center mb-4 px-4 text-sm text-gray-500">
        <div className="w-8">#</div>
        <div>TITLE</div>
        <div>ALBUM</div>
        <div className="w-24"></div>
      </div>

      <div className="space-y-2">
        {filteredTracks.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center p-4 rounded-lg hover:bg-primary/10 transition"
          >
            <div className="w-8 text-gray-400">{index + 1}</div>
            <div className="flex items-center gap-4">
              <img
                src={track.albumCover}
                alt={track.albumTitle}
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <div className="font-medium">{track.title}</div>
                <div className="text-sm text-gray-500">{track.artist}</div>
              </div>
            </div>
            <div className="text-gray-500">{track.albumTitle}</div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleTogglePlay(index)}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  isFavorite(track.id)
                    ? removeFavorite(track.id)
                    : addFavorite({
                        ...track,
                        duration: formatTime(track.duration)
                      })
                }
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite(track.id) ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>
              <TrackMenu track={{
                id: track.id,
                title: track.title,
                path: track.path,
                artist: track.artist,
                image: track.albumCover,
                duration: formatTime(track.duration)
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
