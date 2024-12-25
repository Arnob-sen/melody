"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHistoryStore } from "@/lib/store/history-store";
import { Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/lib/store/player-store";

export function RecentlyPlayed() {
  const { history } = useHistoryStore();
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayerStore();

  const handlePlay = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // When playing a track from history, set all history tracks as the queue
      playQueue(history);
      // Find the index of the track in history
      const trackIndex = history.findIndex(t => t.id === track.id);
      if (trackIndex !== -1) {
        // Play from that position in the queue
        playTrack(track);
      }
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        <div className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Recently Played
        </div>
      </h2>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {history.slice(0, 5).map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-4 group hover:bg-accent/50 p-2 rounded-md"
            >
              <div className="w-12 h-12 rounded-md overflow-hidden relative">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handlePlay(track)}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{track.title}</h3>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}