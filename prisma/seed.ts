import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'Produce',
      description: 'Fresh fruits and vegetables',
    },
    {
      name: 'Dairy',
      description: 'Milk, cheese, yogurt, and other dairy products',
    },
    {
      name: 'Meat',
      description: 'Beef, pork, chicken, and other meats',
    },
    {
      name: 'Seafood',
      description: 'Fish, shellfish, and other seafood',
    },
    {
      name: 'Pantry',
      description: 'Canned goods, pasta, rice, and other dry goods',
    },
    {
      name: 'Frozen',
      description: 'Frozen foods and ice cream',
    },
    {
      name: 'Beverages',
      description: 'Water, juice, soda, and other drinks',
    },
    {
      name: 'Snacks',
      description: 'Chips, cookies, and other snack foods',
    },
    {
      name: 'Condiments',
      description: 'Sauces, spices, and other condiments',
    },
    {
      name: 'Bakery',
      description: 'Bread, pastries, and other baked goods',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 