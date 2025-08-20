"use client";

import { LucideTrash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { TicketStatus } from "@prisma/client";

import { deleteTicket } from "../actions/delete-ticket";
import { updateTicketStatus } from "../actions/update-ticket-status";
import { TICKET_STATUS_LABELS } from "../constants";
import { TicketWithMetadata } from "../types";

type TicketOptionsMenuProps = {
  ticket: TicketWithMetadata;
  trigger: React.ReactElement;
};

const TicketOptionsMenu = ({ ticket, trigger }: TicketOptionsMenuProps) => {
  const hasDeletePermission = ticket.permissions.canDeleteTicket;

  const [deleteButton, deleteDialog] = useConfirmDialog({
    pendingMessage: "Deleting ticket ...",
    action: deleteTicket.bind(null, ticket.id),
    renderTrigger: (onClick, isPending) => (
      <DropdownMenuItem
        onClick={onClick}
        disabled={!hasDeletePermission || isPending}
      >
        <LucideTrash className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    ),
  });

  const handleUpdateTicketStatus = async (value: string) => {
    const promise = updateTicketStatus(ticket.id, value as TicketStatus);

    toast.promise(promise, {
      loading: "Updating status...",
    });

    const result = await promise;

    if (result.status === "ERROR") {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

  const ticketStatusRadioGroupItems = (
    <DropdownMenuRadioGroup
      value={ticket.status}
      onValueChange={handleUpdateTicketStatus}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as Array<TicketStatus>).map((key) => (
        <DropdownMenuRadioItem key={key} value={key}>
          {TICKET_STATUS_LABELS[key]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      {deleteDialog}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          {ticketStatusRadioGroupItems}
          <DropdownMenuSeparator />
          {hasDeletePermission ? (
            deleteButton
          ) : (
            <Tooltip>
              <TooltipTrigger>{deleteButton}</TooltipTrigger>
              <TooltipContent side="left">
                You do not have permission to delete this ticket.
              </TooltipContent>
            </Tooltip>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { TicketOptionsMenu };
