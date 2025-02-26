const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("Resetting database...");

    // 1. Clear the invoices table
    await prisma.invoice.deleteMany();
    console.log("Invoices table cleared.");

    // 2. Clear the revenue table
    await prisma.revenue.deleteMany();
    console.log("Revenue table cleared.");

    // 3. Calculate revenue from paid invoices
    const invoiceData = await prisma.invoice.groupBy({
      by: ["date"],
      where: { status: "paid" },
      _sum: { amount: true },
    });

    // 4. Get all months to ensure complete data in the revenue table
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // 5. Initialize revenue data with 0 for all months
    const revenueMap = Object.fromEntries(allMonths.map((month) => [month, 0]));

    // 6. Update revenue data based on invoices
    for (const { date, _sum } of invoiceData) {
      if (_sum?.amount) {
        const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
          new Date(date)
        );
        revenueMap[month] = _sum.amount;
      }
    }

    // 7. Insert all months into the revenue table
    for (const month of allMonths) {
      await prisma.revenue.upsert({
        where: { month },
        update: { revenue: revenueMap[month] },
        create: { month, revenue: revenueMap[month] },
      });
    }

    console.log(
      "Revenue table reset successfully with zero revenue for missing months."
    );
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
