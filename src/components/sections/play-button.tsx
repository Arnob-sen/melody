import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function PlayButton({ onClick, className, children }: PlayButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      variant="ghost"
      className={cn(
        "hover:bg-white/10 hover:text-white transition",
        className
      )}
    >
      {children || <Play className="h-5 w-5" />}
    </Button>
  );
}
