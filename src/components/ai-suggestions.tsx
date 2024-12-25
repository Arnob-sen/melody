"use client";

import { useState } from "react";
import { Sparkles, Play, Pause } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { usePlayerStore } from "@/lib/store/player-store";
import { Badge } from "./ui/badge";
import { Track } from "@/app/actions/get-artists";

interface Analysis {
  mood: string;
  genres: string[];
  keywords: string[];
}

export function AISuggestions() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<Track[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentTrack, isPlaying, playTrack, setIsPlaying } = usePlayerStore();

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      playTrack(track);
    }
  };

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error("Failed to get suggestions");
      
      const data = await response.json();
      setSuggestions(data.tracks);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Music Suggestions</h2>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Describe your mood or the type of music you're looking for..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getSuggestions()}
              className="flex-1"
            />
            <Button 
              onClick={getSuggestions} 
              disabled={loading || !prompt.trim()}
              className="whitespace-nowrap"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Finding songs..." : "Get Suggestions"}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Try: "Upbeat pop songs for a workout" or "Relaxing jazz for studying"
          </div>
          
          {analysis && (
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="secondary" className="text-sm">
                Mood: {analysis.mood}
              </Badge>
              {analysis.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="text-sm">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.map((track) => (
                  <Card
                    key={track.id}
                    className="p-4 flex items-center gap-4 hover:bg-accent/50 transition group"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <img
                        src={track.image}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handlePlay(track)}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                {loading ? "Finding the perfect songs for you..." : "Enter a prompt to get AI-powered music suggestions"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}