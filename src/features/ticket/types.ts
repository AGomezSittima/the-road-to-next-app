import { Prisma } from "@prisma/client";

import { Permissions } from "../permissions/type";

export type TicketWithMetadata = Prisma.TicketGetPayload<{
  include: { user: { select: { username: true } } };
}> & {
  isOwner: boolean;
  permissions: Permissions;
};
