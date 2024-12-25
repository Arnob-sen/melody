import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Song } from "@/types";
import { getPlaylists } from "@/app/actions/get-playlists";
import { addSongToPlaylist } from "@/app/actions/playlist-actions";
import { useRouter } from "next/navigation";

interface AddToPlaylistButtonProps {
  song: Song;
}

export function AddToPlaylistButton({ song }: AddToPlaylistButtonProps) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data || []);
      } catch (error) {
        console.error("Error loading playlists:", error);
      }
    };

    loadPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    try {
      const result = await addSongToPlaylist(playlistId, song);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(`Added to ${playlistName}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error adding to playlist:", error);
      toast.error(error.message || "Failed to add to playlist");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 bg-neutral-900 border-neutral-800"
        align="end"
      >
        <DropdownMenuLabel className="text-neutral-400">
          Add to Playlist
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        {playlists.length === 0 ? (
          <DropdownMenuItem className="text-neutral-400 cursor-default">
            No playlists found
          </DropdownMenuItem>
        ) : (
          playlists.map((playlist) => (
            <DropdownMenuItem
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              {playlist.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
