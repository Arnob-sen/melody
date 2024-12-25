import { NextResponse } from "next/server";
import { getArtists } from "@/app/actions/get-artists";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function analyzePromptWithAI(prompt: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a music recommendation expert. Analyze the user's prompt and return a JSON object with:
        1. mood (string): The primary mood detected
        2. genres (array): List of music genres that match the mood and prompt
        3. keywords (array): Important keywords from the prompt
        4. artists (array): Any specific artists mentioned or types of artists that would fit
        Format: { "mood": "...", "genres": [...], "keywords": [...], "artists": [...] }`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}

function scoreTrack(track: any, artist: any, analysis: any) {
  let score = 0;
  
  // Genre matching (0-3 points)
  if (artist.genres) {
    analysis.genres.forEach((genre: string) => {
      if (artist.genres.some((g: string) => 
        g.toLowerCase().includes(genre.toLowerCase()) ||
        genre.toLowerCase().includes(g.toLowerCase())
      )) {
        score += 3;
      }
    });
  }

  // Mood matching in title (0-2 points)
  if (track.title.toLowerCase().includes(analysis.mood.toLowerCase())) {
    score += 2;
  }

  // Keyword matching in title (0-2 points per keyword)
  analysis.keywords.forEach((keyword: string) => {
    if (track.title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 2;
    }
  });

  // Artist preference (0-4 points)
  if (analysis.artists.some((a: string) => 
    artist.name.toLowerCase().includes(a.toLowerCase()) ||
    a.toLowerCase().includes(artist.name.toLowerCase())
  )) {
    score += 4;
  }

  // Random factor (0-1 point) to add variety
  score += Math.random();

  return score;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get AI analysis of the prompt
    const analysis = await analyzePromptWithAI(prompt);

    // Get all artists and their tracks
    const artists = await getArtists();
    
    // Score all tracks from all artists
    const scoredTracks = artists.flatMap(artist => 
      artist.tracks.map(track => ({
        track: {
          ...track,
          artist: artist.name,
          image: artist.image
        },
        score: scoreTrack(track, artist, analysis)
      }))
    );

    // Sort by score and get top 5 diverse tracks
    const topTracks = scoredTracks
      .sort((a, b) => b.score - a.score)
      .reduce((acc: any[], curr) => {
        // Ensure diversity by limiting tracks per artist
        const artistCount = acc.filter(t => t.track.artist === curr.track.artist).length;
        if (artistCount < 2 && acc.length < 5) {
          acc.push(curr);
        }
        return acc;
      }, [])
      .map(({ track }) => track);

    return NextResponse.json({
      tracks: topTracks,
      analysis: {
        mood: analysis.mood,
        genres: analysis.genres,
        keywords: analysis.keywords
      }
    });
  } catch (error) {
    console.error("Error in suggestions API:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
