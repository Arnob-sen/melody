'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useSpotify } from "@/lib/hooks/useSpotify";
import { ArtistHeader } from "./artist-header";
import { ArtistTracks } from "./artist-tracks";
import { RelatedArtists } from "./related-artists";

interface ArtistDetailProps {
  artistId: string;
}

export function ArtistDetail({ artistId }: ArtistDetailProps) {
  const {
    loading,
    error,
    artist,
    tracks,
    relatedArtists,
    getArtist,
    getArtistRelated,
    getArtistTopTracks,
  } = useSpotify();

  const loadedRef = useRef(false);

  const loadArtistData = useCallback(async () => {
    if (!artistId || loadedRef.current) return;
    loadedRef.current = true;
    
    try {
      await Promise.all([
        getArtist(artistId),
        getArtistRelated(artistId),
        getArtistTopTracks(artistId),
      ]);
    } catch (err) {
      console.error('Error loading artist data:', err);
    }
  }, [artistId, getArtist, getArtistRelated, getArtistTopTracks]);

  useEffect(() => {
    loadArtistData();
    return () => {
      loadedRef.current = false;
    };
  }, [loadArtistData]);

  if (!artistId) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invalid artist ID</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading artist...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load artist</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Artist not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ArtistHeader artist={artist} />
      <div className="container p-6 space-y-8">
        <ArtistTracks tracks={tracks} />
        <RelatedArtists relatedArtists={relatedArtists} />
      </div>
    </div>
  );
}
