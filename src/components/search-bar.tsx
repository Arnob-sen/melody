"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search songs, artists, or albums..."
        className="pl-10 w-full max-w-2xl"
      />
    </div>
  );
}