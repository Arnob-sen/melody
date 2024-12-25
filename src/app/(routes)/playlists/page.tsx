import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { FeaturedPlaylists } from "@/components/playlists/featured-playlists";

export default function PlaylistsPage() {
  return (
    <div className="container p-6 space-y-8">
      <FeaturedPlaylists />
      <PlaylistGrid />
    </div>
  );
}