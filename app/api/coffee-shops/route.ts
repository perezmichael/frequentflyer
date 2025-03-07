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
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log("Attempting to connect to Supabase...");
    await prisma.$connect();
    console.log("Connected to Supabase");
    const coffeeShops = await prisma.coffeeShop.findMany();
    console.log("Fetched coffee shops:", coffeeShops);
    return NextResponse.json(coffeeShops);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({ error: "Failed to fetch coffee shops", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}