"use client";

import { Heart } from "lucide-react";
import { DownloadsContent } from "./content";

export default function DownloadsPage() {
  return (
    <div className="container p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <Heart className="h-6 w-6 text-red-500" />
      </div>
      <DownloadsContent />
    </div>
  );
}