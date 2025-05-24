import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Create the ingredient
    const ingredient = await prisma.ingredient.create({
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        categories: {
          create: data.categoryIds.map((categoryId: number) => ({ category: { connect: { id: categoryId } } }))
        },
      },
      include: {
        categories: { include: { category: true } },
      },
    });
    // Flatten categories for response
    const flatIngredient = {
      ...ingredient,
      categories: ingredient.categories.map((ic: any) => ic.category),
    };
    return NextResponse.json(flatIngredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to create ingredient' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: {
        categories: { include: { category: true } },
      },
    });
    // Flatten categories for each ingredient
    const flatIngredients = ingredients.map((ingredient: any) => ({
      ...ingredient,
      categories: ingredient.categories.map((ic: any) => ic.category),
    }));
    return NextResponse.json(flatIngredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Ingredient ID is required' },
        { status: 400 }
      );
    }

    await prisma.ingredient.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to delete ingredient' },
      { status: 500 }
    );
  }
} 