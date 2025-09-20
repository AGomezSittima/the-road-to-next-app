import { LucideArrowUpRightFromSquare, LucideSquarePen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getAuth } from "@/features/auth/queries/get-auth";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { membershipsPath, organizationsPath } from "@/utils/paths";

import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const DataContent = async () => {
  const activeOrganization = await getActiveOrganization();

  return (
    <>
      <p className="mx-auto">
        {activeOrganization ? (
          <>
            Active organization&nbsp;-&nbsp;
            <strong className="font-medium">{activeOrganization.name}</strong>
          </>
        ) : (
          <>No active organization</>
        )}
      </p>
      <div className="flex items-center justify-evenly gap-x-2">
        {activeOrganization && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="size-8" asChild>
                <Link href={membershipsPath(activeOrganization.id)}>
                  <LucideArrowUpRightFromSquare />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View organization</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" className="size-8" asChild>
              <Link href={organizationsPath()}>
                <LucideSquarePen />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch organization</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};

const Footer = async () => {
  const { user } = await getAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 flex w-full animate-fade-in-from-bottom items-center justify-center border-2 border-muted bg-background px-4 py-2">
      <Suspense
        fallback={
          <div className="flex items-center gap-x-2">
            <p>Loading</p>
            <Spinner size="xs" />
          </div>
        }
      >
        <DataContent />
      </Suspense>
    </div>
  );
};

export { Footer };
