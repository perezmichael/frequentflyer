import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Fetching coffee shops...')
    const coffeeShops = await prisma.coffeeShop.findMany()
    console.log('Found coffee shops:', coffeeShops)
    return NextResponse.json(coffeeShops)
  } catch (error) {
    console.error('Error fetching coffee shops:', error)
    return NextResponse.json(
      { error: 'Error fetching coffee shops' },
      { status: 500 }
    )
  }
} 