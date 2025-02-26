import { initialTickets } from "@/data";

import { Ticket } from "../types";

export const getTicket = async (
  ticketId: Ticket["id"],
): Promise<Ticket | null> => {
  // TODO: Remove artificial delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const tryTicket = initialTickets.find((ticket) => ticket.id === ticketId);

  return new Promise((resolve) => {
    resolve(tryTicket || null);
  });
};
