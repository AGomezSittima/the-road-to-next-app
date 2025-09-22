import * as ticketDataAccess from "../data";
import { checkTicketIds } from "../queries/check-ticket-ids";

export const connectReferencedTickets = async (
  ticketId: string,
  referencedTicketIds: string[],
) => {
  const referencedTicketIdsInDB = await checkTicketIds(referencedTicketIds);

  await ticketDataAccess.connectReferencedTickets(
    ticketId,
    referencedTicketIdsInDB,
  );
};
