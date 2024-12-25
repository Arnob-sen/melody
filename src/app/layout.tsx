import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MusicPlayer } from '@/components/music-player';
import { Toaster } from '@/components/ui/sonner';
import { PlayerProvider } from "@/lib/hooks/usePlayer";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Melody - Music Streaming Platform',
  description: 'Stream and discover music with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden bg-background">
          <PlayerProvider>
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
              <MusicPlayer />
            </div>
          </PlayerProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}