"use client";

import { useQueryState } from "nuqs";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { appConfig } from "@/utils/app-config";

import { onlyActiveOrganizationParser } from "../search-params";

const TicketOnlyActiveOrganizationSwitch = () => {
  const [onlyActiveOrganization, setOnlyActiveOrganization] = useQueryState(
    appConfig.paramsKeys.ticketOnlyActiveOrganization,
    onlyActiveOrganizationParser,
  );

  const handleSwitch = (checked: boolean) => {
    setOnlyActiveOrganization(checked);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Switch
        id="only-active-organization"
        checked={onlyActiveOrganization}
        onCheckedChange={handleSwitch}
      />
      <Label htmlFor="only-active-organization" className="text-xs font-normal">
        Only Active Organization?
      </Label>
    </div>
  );
};

export { TicketOnlyActiveOrganizationSwitch };
