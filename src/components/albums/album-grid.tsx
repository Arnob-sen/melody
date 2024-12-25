import React from "react";
import { Card } from "@/components/ui/card";
import { SpotifyAlbum, SpotifyTrack } from "@/lib/types/spotify";
import { toast } from "sonner";
import { AlbumDialog } from "./album-dialog";
import { SpotifyService } from "@/lib/services/spotify-api";

interface AlbumGridProps {
  albums: SpotifyAlbum[];
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  const [selectedAlbum, setSelectedAlbum] = React.useState<SpotifyAlbum | null>(null);
  const [tracks, setTracks] = React.useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!albums?.length) {
    return (
      <div className="text-center text-gray-500">No albums found</div>
    );
  }

  const handleAlbumClick = async (album: SpotifyAlbum) => {
    console.log('Album clicked:', album);
    if (!album?.id) {
      toast.error('Could not load album tracks: Invalid album ID');
      return;
    }

    setSelectedAlbum(album);
    setIsLoading(true);

    try {
      const response = await SpotifyService.getAlbumTracks(album.id);
      if (response.success && response.data.album.tracks) {
        setTracks(response.data.album.tracks);
      } else {
        throw new Error('Failed to load tracks');
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
      toast.error('Failed to load album tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const getArtistNames = (album: SpotifyAlbum) => {
    if (!album.artists?.items) return '';
    return album.artists.items.map(artist => artist.profile?.name || '').filter(Boolean).join(', ');
  };

  const getCoverImage = (album: SpotifyAlbum) => {
    if (!album.coverArt?.[0]?.url) return null;
    return album.coverArt[0].url;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.map((album) => (
          <Card
            key={album.id}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleAlbumClick(album)}
          >
            {getCoverImage(album) && (
              <img
                src={getCoverImage(album)}
                alt={album.name}
                className="w-full h-auto rounded-md mb-2"
              />
            )}
            <h3 className="font-medium text-sm truncate">{album.name}</h3>
            <p className="text-xs text-gray-500 truncate">
              {getArtistNames(album)}
            </p>
            <p className="text-xs text-gray-400">
              {album.date?.year || ''}
            </p>
          </Card>
        ))}
      </div>

      <AlbumDialog
        album={selectedAlbum}
        tracks={tracks}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </>
  );
}