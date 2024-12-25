// Spotify API Response Types
export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  explicit: boolean;
  artists: {
    id: string;
    name: string;
    uri: string;
  }[];
  album: {
    id: string;
    name: string;
    images: {
      url: string;
      height: number | null;
      width: number | null;
    }[];
    release_date: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  tracks: {
    total: number;
  };
  owner: {
    id: string;
    display_name: string;
  };
  followers: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  uri: string;
  name: string;
  type: string;
  artists: {
    items: Array<{
      uri: string;
      profile: {
        name: string;
      };
    }>;
  };
  coverArt: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  date: {
    year: number;
  };
}

export interface SpotifyAlbumTrack {
  artists: {
    external_urls: {
      spotify: string;
    };
    id: string;
    name: string;
    type: string;
    uri: string;
  }[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface AlbumTracksResponse {
  success: boolean;
  data: {
    album: {
      id: string;
      tracks: SpotifyAlbumTrack[];
    };
    pagingInfo: {
      total: number;
      limit: number;
      offset: number;
      next: boolean;
      previous: boolean;
    };
  };
  generatedTimeStamp: number;
}

export interface AlbumsResponse {
  success: boolean;
  data: {
    albums: SpotifyAlbum[];
  };
  generatedTimeStamp: number;
}

export interface SpotifyArtist {
  type: string;
  id: string;
  uri: string;
  profile: {
    name: string;
    verified: boolean;
  };
  avatarImg: {
    height: number;
    url: string;
    width: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  generatedTimeStamp: number;
}

export interface DownloadResponse {
  success: boolean;
  data: {
    playlistDetails?: {
      artist: string;
      title: string;
      cover: string;
      releaseDate: string | null;
    };
    albumDetails?: {
      artist: string;
      title: string;
      cover: string;
      releaseDate: string;
    };
    count: number;
    songs: {
      id: string;
      artist: string;
      title: string;
      album: string;
      cover: string;
      releaseDate: string;
      downloadLink: string;
    }[];
  };
  generatedTimeStamp: number;
}

export interface SpotifySearchResult {
  success: boolean;
  data: {
    albums: {
      items: any[];
      totalCount: number;
    };
    artists: {
      items: SpotifyArtist[];
      totalCount: number;
    };
    episodes: {
      items: any[];
      totalCount: number;
    };
  };
  generatedTimeStamp: number;
}

export interface DownloadSongResponse {
  success: boolean;
  data: {
    id: string;
    artist: string;
    title: string;
    album: string;
    cover: string;
    releaseDate: string;
    downloadLink: string;
  };
  generatedTimeStamp: number;
}