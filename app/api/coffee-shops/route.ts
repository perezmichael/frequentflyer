import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ["query", "info", "warn", "error"], // Detailed logging
});

export async function GET() {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL); // Log the URL
    console.log("Fetching coffee shops...");
    const coffeeShops = await prisma.coffeeShop.findMany();
    console.log("Fetched coffee shops:", coffeeShops);
    return NextResponse.json(coffeeShops);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Detailed error fetching coffee shops:", error);
      return NextResponse.json({ error: "Failed to fetch coffee shops", details: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error fetching coffee shops:", error);
      return NextResponse.json({ error: "Failed to fetch coffee shops", details: "Unknown error" }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}