import Link from "next/link";
import { Home, Mic2, Album, ListMusic, Users, Download, History } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Tracks", href: "/tracks", icon: Mic2 },
  { name: "Albums", href: "/albums", icon: Album },
  { name: "Playlists", href: "/playlists", icon: ListMusic },
  { name: "Artists", href: "/artists", icon: Users },
  { name: "Favourites", href: "/favourites", icon: Download },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  return (
    <div className="h-full w-[240px] border-r bg-card flex flex-col">
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold">Melody</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 md:px-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}