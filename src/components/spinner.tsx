import { LucideLoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type Size = "xs" | "s" | "base" | "lg";
type SpinnerProps = {
  size?: Size;
};

const sizes: Record<Size, string> = {
  xs: "size-4",
  s: "size-8",
  base: "size-16",
  lg: "size-24",
};

const Spinner = ({ size = "base" }: SpinnerProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center self-center">
      <LucideLoaderCircle className={cn("animate-spin", sizes[size])} />
    </div>
  );
};

export { Spinner };
