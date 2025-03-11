import React from "react";

export type NavItem = {
  title: string;
  icon: React.ReactElement<SVGElement, "svg">;
  href: string;
};
