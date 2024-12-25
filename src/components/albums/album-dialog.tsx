import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SpotifyAlbum, SpotifyTrack } from "@/lib/types/spotify";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Plus } from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { AddToPlaylistButton } from "@/components/add-to-playlist-button";
import { toast } from "sonner";

interface AlbumDialogProps {
  album: SpotifyAlbum | null;
  tracks: SpotifyApi.TrackObjectFull[];
  isOpen: boolean;
  onClose: () => void;
}

export function AlbumDialog({ album, tracks, isOpen, onClose }: AlbumDialogProps) {
  const { 
    currentTrack, 
    isPlaying,
    playQueue,
    playTrack,
    setIsPlaying
  } = usePlayerStore();

  const handlePlayPause = (track: SpotifyApi.TrackObjectFull) => {
    if (!track.preview_url) {
      return;
    }

    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      // Set up the queue first, then play the selected track
      playQueue(tracks);
      playTrack(track);
    }
  };

  if (!album) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" aria-describedby="album-description">
        <DialogHeader>
          <DialogTitle>{album.name}</DialogTitle>
        </DialogHeader>
        
        <div id="album-description" className="space-y-4">
          <div className="flex items-start space-x-4">
            {album.coverArt?.[0]?.url && (
              <img
                src={album.coverArt[0].url}
                alt={`${album.name} cover`}
                className="w-40 h-40 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">
                {album.artists?.items?.map(artist => artist.profile.name).join(", ")}
              </h3>
              <p className="text-sm text-gray-500">
                {tracks.length} tracks • {album.date?.year}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {tracks.map((track) => {
              const trackWithMeta = {
                ...track,
                image: album.coverArt?.[0]?.url || "/images/music-placeholder.png",
                artist: album.artists?.items?.map(artist => artist.profile.name).join(", ") || "",
              };
           

              return (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg group"
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePlayPause(track)}
                      disabled={!track.preview_url}
                      title={track.preview_url ? "Play preview" : "No preview available"}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <PauseCircle className="h-6 w-6" />
                      ) : (
                        <PlayCircle className="h-6 w-6" />
                      )}
                    </Button>
                    <span>{track.name}</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm text-gray-500">
                      {Math.floor(track.duration_ms / 60000)}:
                      {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
                    </span>
                    <AddToPlaylistButton song={trackWithMeta} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
