import { LucideMessageSquareWarning } from "lucide-react";
import React from "react";

type PlaceholderProps = {
  label: string;
  renderIcon?: (
    className: string,
  ) => React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
  renderButton?: (
    className: string,
  ) => React.ReactElement<
    HTMLButtonElement | HTMLAnchorElement,
    "button" | "a"
  >;
};

const Placeholder = ({
  label,
  renderIcon = (className) => (
    <LucideMessageSquareWarning className={className} />
  ),
  renderButton = (className) => <div className={className} />,
}: PlaceholderProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2 self-center">
      {renderIcon("h-16 w-16")}
      <h2 className="text-center text-lg font-semibold">{label}</h2>
      {renderButton("h-10")}
    </div>
  );
};

export { Placeholder };
