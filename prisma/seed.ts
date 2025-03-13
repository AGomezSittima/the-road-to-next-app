import { hashPassword } from "@/lib/auth/password";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    username: "admin",
    email: "admin@admin.com",
    firstName: "Admin",
  },
  {
    username: "user",
    email: process.env.PERSONAL_EMAIL ?? "",
    firstName: "User",
  },
];

const tickets = [
  {
    title: "Ticket 1",
    content: "This is the first ticket from the database.",
    status: "DONE" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 499, // $4.99
  },
  {
    title: "Ticket 2",
    content: "This is the second ticket from the database.",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 399, // $3.99
  },
  {
    title: "Ticket 3",
    content: "This is the third ticket from the database.",
    status: "IN_PROGRESS" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 599, // $5.99
  },
  {
    title: "Lorem ipsum (DB)",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mattis malesuada sem, non varius turpis malesuada auctor. Nam mollis sem vitae sagittis pretium. Nullam id aliquam orci. Sed varius molestie viverra. Vestibulum porta ut felis porta dignissim. Phasellus consectetur nisl vitae fermentum convallis. Praesent ultricies scelerisque ex, eget hendrerit ex tincidunt eget. Aliquam erat volutpat. Aliquam ornare, lacus eget rutrum ornare, est sapien rutrum ex, et eleifend magna sem ut leo. Quisque posuere dolor vitae arcu facilisis varius. Quisque sed mollis mauris, sit amet molestie ex. Nam tincidunt mi vel ante pretium vestibulum. Praesent eu vehicula dolor. Proin ultrices lectus non neque dapibus, rutrum volutpat mauris placerat. Cras sed risus mi. Sed magna velit, condimentum vitae varius nec, dapibus sed.",
    status: "OPEN" as const,
    deadline: new Date().toISOString().split("T")[0],
    bounty: 699, // $6.99
  },
];

const seed = async () => {
  const t0 = performance.now();
  console.log("DB Seed: Started ...");

  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hashPassword("secret123");

  const dbUsers = await prisma.user.createManyAndReturn({
    data: users.map((user) => ({ ...user, passwordHash })),
  });

  await prisma.ticket.createMany({
    data: tickets.map((ticket) => ({ ...ticket, userId: dbUsers[0].id })),
  });

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${t1 - t0}ms) ...`);
};

seed();
