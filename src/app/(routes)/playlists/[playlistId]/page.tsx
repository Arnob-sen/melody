import { getPlaylist, getPlaylists } from "@/app/actions/get-playlists";
import { PlaylistHeader } from "@/components/playlists/playlist-header";
import { PlaylistTracks } from "@/components/playlists/playlist-tracks";
import { Metadata } from "next";

interface PlaylistPageProps {
  params: {
    playlistId: string;
  };
}

export async function generateMetadata({ params }: PlaylistPageProps): Promise<Metadata> {
  const playlist = await getPlaylist(params.playlistId);

  return {
    title: playlist?.name || 'Playlist Not Found',
    description: playlist?.description || 'Playlist details'
  };
}

export async function generateStaticParams() {
  try {
    const playlists = await getPlaylists();
    return playlists.map((playlist) => ({
      playlistId: playlist.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  try {
    const playlist = await getPlaylist(params.playlistId);

    if (!playlist) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-neutral-400">Playlist not found</div>
        </div>
      );
    }

    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <PlaylistHeader playlist={playlist} />
        <PlaylistTracks playlist={playlist} />
      </div>
    );
  } catch (error) {
    console.error('Error loading playlist:', error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-neutral-400">Error loading playlist</div>
      </div>
    );
  }
}
