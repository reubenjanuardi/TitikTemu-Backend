import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
