import { FeaturedSection } from "@/components/sections/featured-section";
import { TopCharts } from "@/components/sections/top-charts";
import { RecentlyPlayed } from "@/components/sections/recently-played";
import { Categories } from "@/components/categories";
import { FeaturedArtists } from "@/components/featured-artists";
import { getArtists } from "./actions/get-artists";
import { AISuggestions } from "@/components/ai-suggestions";

export default async function Home() {
  const artists = await getArtists();

  return (
    <div className="container p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
      <FeaturedSection />
      <Categories />
      <FeaturedArtists artists={artists} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <TopCharts />
        <RecentlyPlayed />
      </div>
      <AISuggestions />
    </div>
  );
}
