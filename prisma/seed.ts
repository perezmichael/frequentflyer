import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const coffeeShops = [
  {
    name: "Blue Bottle Coffee",
    lat: 34.0371,
    lng: -118.2412,
    rating: 4.5,
    cuisine: "Coffee & Tea",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3",
    description: "Trendy cafe chain offering house-roasted coffee drinks & pastries in an industrial-chic setting."
  },
  {
    name: "Verve Coffee Roasters",
    lat: 34.0455,
    lng: -118.2334,
    rating: 4.7,
    cuisine: "Coffee & Tea",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3",
    description: "Hip coffee shop featuring house-roasted beans, plus espresso drinks & cold brew in modern digs."
  },
  {
    name: "Intelligentsia Coffee",
    lat: 34.0392,
    lng: -118.2516,
    rating: 4.6,
    cuisine: "Coffee & Tea",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3",
    description: "Upscale coffeehouse chain serving seasonal, direct-trade coffee in an industrial-chic setting."
  },
  {
    name: "Stumptown Coffee Roasters",
    lat: 34.0505,
    lng: -118.2478,
    rating: 4.8,
    cuisine: "Coffee & Tea",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3",
    description: "Portland-based coffee roaster featuring carefully sourced beans & hip, industrial-style decor."
  },
  {
    name: "G&B Coffee",
    lat: 34.0505,
    lng: -118.2478,
    rating: 4.4,
    cuisine: "Coffee & Tea",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3",
    description: "Counter serving specialty coffee drinks, tea & pastries in Grand Central Market."
  }
]

async function main() {
  console.log('Start seeding ...')
  
  // Clear existing data
  await prisma.coffeeShop.deleteMany()
  
  for (const shop of coffeeShops) {
    const coffeeShop = await prisma.coffeeShop.create({
      data: shop,
    })
    console.log(`Created coffee shop with id: ${coffeeShop.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })