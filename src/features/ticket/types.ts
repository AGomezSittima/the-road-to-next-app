export type TicketStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export type Ticket = {
  id: string; // Unique identifier
  title: string; // Ticket title
  content: string; // Ticket content
  status: TicketStatus; // Ticket status
};
