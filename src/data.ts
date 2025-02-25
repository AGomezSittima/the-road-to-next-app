import { Ticket } from "./features/ticket/types";

export const initialTickets: Ticket[] = [
  {
    id: "1",
    title: "Ticket 1",
    content: "This is the first ticket.",
    status: "DONE" as const,
  },
  {
    id: "2",
    title: "Ticket 2",
    content: "This is the second ticket.",
    status: "OPEN" as const,
  },
  {
    id: "3",
    title: "Ticket 3",
    content: "This is the third ticket.",
    status: "IN_PROGRESS" as const,
  },
  {
    id: "4",
    title: "Lorem ipsum",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mattis malesuada sem, non varius turpis malesuada auctor. Nam mollis sem vitae sagittis pretium. Nullam id aliquam orci. Sed varius molestie viverra. Vestibulum porta ut felis porta dignissim. Phasellus consectetur nisl vitae fermentum convallis. Praesent ultricies scelerisque ex, eget hendrerit ex tincidunt eget. Aliquam erat volutpat. Aliquam ornare, lacus eget rutrum ornare, est sapien rutrum ex, et eleifend magna sem ut leo. Quisque posuere dolor vitae arcu facilisis varius. Quisque sed mollis mauris, sit amet molestie ex. Nam tincidunt mi vel ante pretium vestibulum. Praesent eu vehicula dolor. Proin ultrices lectus non neque dapibus, rutrum volutpat mauris placerat. Cras sed risus mi. Sed magna velit, condimentum vitae varius nec, dapibus sed.",
    status: "OPEN" as const,
  },
];
