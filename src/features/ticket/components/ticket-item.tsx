import {
  LucideMoreVertical,
  LucidePencil,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toCurrencyFromCent } from "@/utils/currency";
import { ticketEditPath, ticketPath } from "@/utils/paths";

import { TICKET_ICONS } from "../constants";
import { TicketWithMetadata } from "../types";
import { TicketOptionsMenu } from "./ticket-options-menu";

type TicketItemProps = {
  ticket: TicketWithMetadata;
  isDetail?: boolean;
  attachments?: React.ReactNode;
  referencedTickets?: React.ReactNode;
  comments?: React.ReactNode;
};

const TicketItem = ({
  ticket,
  isDetail,
  attachments,
  referencedTickets,
  comments,
}: TicketItemProps) => {
  const hasUpdatePermission = ticket.permissions.canUpdateTicket;

  const detailButton = (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ticketPath(ticket.id)}>
        <span className="sr-only">Go to ticket {ticket.title}</span>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  const editButton = hasUpdatePermission ? (
    <Button asChild variant="outline" size="icon">
      <Link prefetch href={ticketEditPath(ticket.id)}>
        <span className="sr-only">Go to ticket {ticket.title}</span>
        <LucidePencil className="h-4 w-4" />
      </Link>
    </Button>
  ) : null;

  const optionsMenu = ticket.isOwner ? (
    <TicketOptionsMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon">
          <LucideMoreVertical className="h-4 w-4" />
        </Button>
      }
    />
  ) : null;

  return (
    <div
      className={cn("flex w-full max-w-[420px] flex-col gap-y-4", {
        "max-w-[580px]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <div className="flex gap-x-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex gap-x-2">
              <span>{TICKET_ICONS[ticket.status]}</span>
              <h3 className="truncate">{ticket.title}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={cn("whitespace-break-spaces", {
                "line-clamp-3": !isDetail,
              })}
            >
              {ticket.content}
            </span>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {ticket.deadline} by {ticket.user.username}
            </p>
            <p className="text-sm text-muted-foreground">
              {toCurrencyFromCent(ticket.bounty)}
            </p>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-y-1">
          {isDetail ? (
            <>
              {editButton}
              {optionsMenu}
            </>
          ) : (
            <>
              {detailButton}
              {editButton}
            </>
          )}
        </div>
      </div>

      {attachments}
      {referencedTickets}
      {comments}
    </div>
  );
};

export { TicketItem };
