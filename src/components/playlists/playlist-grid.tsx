"use client";

import { getPlaylists, Playlist } from "@/app/actions/get-playlists";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePlaylistDialog } from "./create-playlist-dialog";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export function PlaylistGrid() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadPlaylists = async () => {
      const data = await getPlaylists();
      setPlaylists(data);
    };
    loadPlaylists();
  }, [refreshKey]);

  const handlePlaylistCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    if (playlist?.id) {
      router.push(`/playlists/${encodeURIComponent(playlist.id)}`);
    }
  };
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">All Playlists</h2>
        <CreatePlaylistDialog onPlaylistCreated={handlePlaylistCreated} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          // <Link href={`/playlists/${encodeURIComponent(playlist.id)}`} key={playlist.id}>
            <Card className="group overflow-hidden" onClick={() => handlePlaylistClick(playlist)} key={playlist.id}>
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={playlist.image || '/images/playlist-default.png'}
                  alt={playlist.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/playlist-default.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="icon" className="rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
                <p className="text-sm text-gray-400 mt-1">{playlist.tracks?.length || 0} tracks</p>
              </div>
            </Card>
          // </Link>
        ))}
      </div>
    </section>
  );
}