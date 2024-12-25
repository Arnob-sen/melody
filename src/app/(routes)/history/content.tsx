"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History, Pause, Play, Trash2, X } from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { useHistoryStore } from "@/lib/store/history-store";
import { formatDistanceToNow } from 'date-fns';

export function HistoryContent() {
  const { currentTrack, isPlaying, playTrack, playQueue, togglePlay } = usePlayerStore();
  const { history, removeFromHistory, clearHistory } = useHistoryStore();

  const handlePlayTrack = (trackIndex: number) => {
    // When playing a track, set all history tracks as the queue
    playQueue(history);
    // Then play the selected track
    playTrack(history[trackIndex]);
  };

  const handleTogglePlay = (trackIndex: number) => {
    if (currentTrack?.id === history[trackIndex].id) {
      togglePlay();
    } else {
      handlePlayTrack(trackIndex);
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <History className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Listening History</h2>
        <p className="text-gray-500">
          Your recently played tracks will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearHistory}
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      <Card className="p-4">
        <div className="space-y-2">
          {history.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center p-4 rounded-lg hover:bg-primary/10 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(track.playedAt, { addSuffix: true })}
              </div>
              <div className="text-gray-500">
                {track.duration}
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
                  onClick={() => removeFromHistory(track.id)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
