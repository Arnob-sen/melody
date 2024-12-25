'use client';

import { LocalAlbum } from "@/app/actions/get-local-music";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pause, Play, Heart } from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { TrackMenu } from "@/components/tracks/track-menu";

interface AlbumContentProps {
  album: LocalAlbum;
}

function formatTime(duration: string | number) {
  if (typeof duration === 'string') {
    return duration;
  }
  const minutes = Math.floor(duration / 60);
  const secondsRemaining = Math.floor(duration % 60);
  return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
}

export default function AlbumContent({ album }: AlbumContentProps) {
  const { currentTrack, isPlaying, playTrack, setIsPlaying, playQueue, togglePlay } = usePlayerStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const handlePlayTrack = (trackIndex: number) => {
    // When playing a track, set the entire album as the queue
    playQueue(album.tracks);
    // Then play the selected track
    playTrack(album.tracks[trackIndex]);
  };

  const handleTogglePlay = (trackIndex: number) => {
    if (currentTrack?.id === album.tracks[trackIndex].id) {
      togglePlay();
    } else {
      handlePlayTrack(trackIndex);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Card className="w-[300px]">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
          <p className="text-xl text-gray-500 mb-4">{album.artist}</p>
          {album.year && (
            <p className="text-sm text-gray-400 mb-4">Released: {album.year}</p>
          )}
          <p className="text-sm text-gray-400 mb-6">
            {album.tracks.length} tracks
          </p>
          {album.description && (
            <p className="text-gray-600 mb-4">{album.description}</p>
          )}
          {album.genre && (
            <p className="text-sm text-gray-500">Genre: {album.genre}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Tracks</h2>
        <div className="space-y-2">
          {album.tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center p-3 hover:bg-primary/10 rounded-lg transition"
            >
              <div className="w-8 text-gray-400">{index + 1}</div>
              <div className="flex-grow">
                <p className="font-medium">{track.title}</p>
                <p className="text-sm text-gray-500">{track.artist}</p>
              </div>
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
                          artist: album.artist,
                          image: album.coverImage,
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
                  artist: album.artist,
                  image: album.coverImage,
                  duration: formatTime(track.duration)
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
