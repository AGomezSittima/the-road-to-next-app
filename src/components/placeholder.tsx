import { LucideMessageSquareWarning } from "lucide-react";
import React, { cloneElement } from "react";

type PlaceholderProps = {
  label: string;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>, "svg">;
  button?: React.ReactElement<
    HTMLButtonElement | HTMLAnchorElement,
    "button" | "a"
  >;
};

const Placeholder = ({
  label,
  icon = <LucideMessageSquareWarning />,
  button = <div className="h-10" />,
}: PlaceholderProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-2 self-center">
      {cloneElement(icon, { className: "w-16 h-16" })}
      <h2 className="text-center text-lg font-semibold">{label}</h2>
      {cloneElement(button, { className: "h-10" })}
    </div>
  );
};

export { Placeholder };
