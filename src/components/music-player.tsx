"use client";

import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { usePlayerStore } from "@/lib/store/player-store";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { 
    currentTrack, 
    isPlaying,
    setIsPlaying,
    nextTrack,
    previousTrack,
    audioElement,
    currentTime,
    setCurrentTime,
    togglePlay
  } = usePlayerStore();

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    if (!audioElement) return;

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      nextTrack();
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [audioElement, nextTrack, setIsPlaying, setCurrentTime]);

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement]);

  const handleTogglePlayPause = () => {
    if (!currentTrack) {
      toast.error("No track selected");
      return;
    }
    togglePlay();
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed left-0 right-0 bottom-0">
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-1/2 transform -translate-x-1/2 -top-8 rounded-t-lg rounded-b-none h-8 bg-background border-x border-t hover:bg-muted/50 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronUp className="h-4 w-4 text-foreground" /> : <ChevronDown className="h-4 w-4 text-foreground" />}
      </Button>
      <Card 
        className={cn(
          "transition-transform duration-300 ease-in-out border-t",
          isCollapsed ? "transform translate-y-[calc(100%-48px)]" : "transform translate-y-0"
        )}
      >
        <div className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 w-full sm:w-auto sm:flex-1 min-h-[48px]">
              <div className="w-12 h-12 relative shrink-0">
                {currentTrack.coverImage ? (
                  <img
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <Music className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{currentTrack.title}</div>
                <div className="text-sm text-gray-500 truncate">{currentTrack.artist}</div>
              </div>
            </div>

            <div className="flex-1 max-w-xl w-full sm:w-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousTrack}
                  className="hidden sm:inline-flex"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTogglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  className="hidden sm:inline-flex"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs sm:text-sm">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-xs sm:text-sm">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 justify-end sm:flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  isFavorite(currentTrack.id)
                    ? removeFavorite(currentTrack.id)
                    : addFavorite(currentTrack)
                }
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite(currentTrack.id) ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0])}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}