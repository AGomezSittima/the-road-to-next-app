import React from "react";

import { Separator } from "./ui/separator";

type HeadingProps = {
  title: string;
  description?: string;
  tabs?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
};

const Heading = ({
  title,
  description,
  breadcrumbs,
  tabs,
  actions,
}: HeadingProps) => {
  return (
    <>
      {breadcrumbs}

      <div className="flex items-center justify-between px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && <div className="flex gap-x-2">{actions}</div>}
      </div>

      {tabs && <div className="flex items-center justify-center">{tabs}</div>}
      <Separator />
    </>
  );
};

export { Heading };
