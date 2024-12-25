import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const categories = [
  { id: "pop", name: "Pop", color: "bg-pink-500" },
  { id: "rock", name: "Rock", color: "bg-purple-500" },
  { id: "hiphop", name: "Hip Hop", color: "bg-blue-500" },
  { id: "jazz", name: "Jazz", color: "bg-yellow-500" },
  { id: "electronic", name: "Electronic", color: "bg-green-500" },
  { id: "classical", name: "Classical", color: "bg-orange-500" },
];

export function Categories() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Browse Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group relative aspect-square w-[120px] sm:w-[150px] overflow-hidden"
            >
              <div className={`absolute inset-0 ${category.color} opacity-90`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-medium text-sm sm:text-base">{category.name}</span>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}