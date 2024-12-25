"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AISuggestions() {
  const [prompt, setPrompt] = useState("");

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Music Suggestions</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the music you're looking for..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Get Suggestions
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Try: "Upbeat pop songs for a workout" or "Relaxing jazz for studying"
        </div>
        
        <div className="mt-4">
          <p className="text-center text-muted-foreground">
            Enter a prompt to get AI-powered music suggestions
          </p>
        </div>
      </div>
    </Card>
  );
}