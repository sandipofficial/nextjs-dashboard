import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "Customer", description: "Customer with content access" },
    { name: "User", description: "Regular user with limited access" },
    { name: "Admin", description: "Administrator with full access" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name as any }, // Ensure uniqueness
      update: {}, // Do nothing if it exists
      create: {
        name: role.name as any, // Enum requires explicit type casting
        description: role.description,
      },
    });
  }

  console.log("Seeding roles completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding roles:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
