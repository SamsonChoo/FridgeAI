import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecipeHistory } from '@/generated/prisma';

export async function GET() {
  try {
    const history = await prisma.recipeHistory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse the JSON strings back to objects
    const parsedHistory = history.map((entry: RecipeHistory) => ({
      ...entry,
      options: JSON.parse(entry.options),
      ingredients: JSON.parse(entry.ingredients),
    }));

    return NextResponse.json(parsedHistory);
  } catch (error) {
    console.error('Error fetching recipe history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe history' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate and ensure options and ingredients are stringified JSON
    const optionsString = typeof data.options === 'object' ? JSON.stringify(data.options) : data.options;
    const ingredientsString = typeof data.ingredients === 'object' ? JSON.stringify(data.ingredients) : data.ingredients;

    const recipeHistory = await prisma.recipeHistory.create({
      data: {
        suggestion: data.suggestion,
        options: optionsString,
        ingredients: ingredientsString,
      },
    });
    return NextResponse.json(recipeHistory);
  } catch (error) {
    console.error('Error creating recipe history:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe history' },
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
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.recipeHistory.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe history:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe history' },
      { status: 500 }
    );
  }
} 