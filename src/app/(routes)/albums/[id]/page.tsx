import { AlbumHeader } from "@/components/albums/album-header";
import { AlbumTracks } from "@/components/albums/album-tracks";
import { RelatedAlbums } from "@/components/albums/related-albums";

export default function AlbumDetailPage() {
  return (
    <div className="space-y-6">
      <AlbumHeader />
      <div className="container p-6 space-y-8">
        <AlbumTracks />
        <RelatedAlbums />
      </div>
    </div>
  );
}