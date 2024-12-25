"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { AddToPlaylistDialog } from "./add-to-playlist-dialog";
import { useState } from "react";

interface TrackMenuProps {
  track: {
    id: string;
    title: string;
    path: string;
    duration: string;
    artist: string;
    image: string;
  };
}

export function TrackMenu({ track }: TrackMenuProps) {
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowPlaylistDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddToPlaylistDialog 
        track={track} 
        open={showPlaylistDialog} 
        onOpenChange={setShowPlaylistDialog}
      />
    </>
  );
}
