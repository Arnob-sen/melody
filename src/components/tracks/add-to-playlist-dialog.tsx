"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPlaylists, addTrackToPlaylist, PlaylistTrack } from "@/app/actions/get-playlists";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddToPlaylistDialogProps {
  track: {
    id: string;
    title: string;
    path: string;
    duration: string;
    artist: string;
    image: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToPlaylistDialog({ track, open, onOpenChange }: AddToPlaylistDialogProps) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPlaylists = async () => {
      const data = await getPlaylists();
      setPlaylists(data);
    };
    loadPlaylists();
  }, [open]);

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    const success = await addTrackToPlaylist(playlistId, track as PlaylistTrack);
    if (success) {
      onOpenChange(false);
      router.refresh();
      toast.success(`Added "${track.title}" to playlist "${playlistName}"`);
    } else {
      toast.error("Failed to add track to playlist");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to add "{track.title}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {playlists.length === 0 ? (
            <p className="text-sm text-neutral-400">No playlists found. Create one first!</p>
          ) : (
            playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start text-left hover:bg-primary/10 transition-colors"
                onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
              >
                {playlist.name}
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
