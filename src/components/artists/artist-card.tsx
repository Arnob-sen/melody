"use client";

import { Card } from "@/components/ui/card";
import { Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ArtistCardProps {
  id: string;
  name: string;
  image: string;
  verified: boolean;
  uri: string;
}

export function ArtistCard({ name, image, verified }: ArtistCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="icon" className="rounded-full">
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold truncate">{name}</h3>
          {verified && (
            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center">
              <Check className="h-3 w-3" />
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}