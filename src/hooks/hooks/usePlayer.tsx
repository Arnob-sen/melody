'use client';

import { createContext, useContext, useRef, useState } from "react";
import { LocalTrack } from "@/app/actions/get-local-music";

interface PlayerContextType {
  currentTrack: LocalTrack | null;
  isPlaying: boolean;
  play: (track: LocalTrack) => void;
  pause: () => void;
  toggle: (track: LocalTrack) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<LocalTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (track: LocalTrack) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (currentTrack?.id !== track.id) {
      audioRef.current.src = track.path;
      setCurrentTrack(track);
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = (track: LocalTrack) => {
    if (!currentTrack || currentTrack.id !== track.id) {
      play(track);
    } else if (isPlaying) {
      pause();
    } else {
      play(track);
    }
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, play, pause, toggle }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
