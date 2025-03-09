import { LucideKanban } from "lucide-react";
import Link from "next/link";

import { homePath, signInPath, signUpPath, ticketsPath } from "@/utils/path";

import { ThemeSwitcher } from "./theme/theme-switcher";
import { buttonVariants } from "./ui/button";

type NavItem = {
  path: string;
  name: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
};

const Header = () => {
  const navItems: NavItem[] = [
    {
      path: ticketsPath(),
      name: "Tickets",
      buttonVariant: "default",
    },
    {
      path: signUpPath(),
      name: "Sign Up",
      buttonVariant: "outline",
    },
    {
      path: signInPath(),
      name: "Sign In",
      buttonVariant: "outline",
    },
  ];

  return (
    <nav className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 flex w-full justify-between border-b bg-background/95 px-5 py-2.5 backdrop-blur">
      <div className="align-items flex gap-x-2">
        <Link
          href={homePath()}
          className={buttonVariants({ variant: "ghost" })}
        >
          <LucideKanban />
          <h1 className="text-lg font-semibold">TicketBounty</h1>
        </Link>
      </div>
      <div className="align-items flex gap-x-2">
        <ThemeSwitcher />
        {navItems.map((navItem) => (
          <Link
            key={navItem.path}
            href={navItem.path}
            className={buttonVariants({ variant: navItem.buttonVariant })}
          >
            {navItem.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export { Header };
