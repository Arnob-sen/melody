"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const featuredSong = {
  title: "Featured Track",
  artist: "Featured Artist",
  image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  description: "Discover this week's featured track, handpicked for you.",
};

export function FeaturedSection() {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 aspect-[3/2] md:aspect-[2/1] relative">
          <img
            src={featuredSong.image}
            alt={featuredSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        </div>
        <div className="p-4 md:p-6 md:w-1/3 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{featuredSong.title}</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-2">{featuredSong.artist}</p>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">{featuredSong.description}</p>
          <Button className="w-fit">
            <Play className="mr-2 h-4 w-4" />
            Play Now
          </Button>
        </div>
      </div>
    </Card>
  );
}