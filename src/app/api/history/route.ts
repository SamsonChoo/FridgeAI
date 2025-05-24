import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const history = await prisma.recipeHistory.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Parse the JSON strings back to objects
    const parsedHistory = history.map(entry => ({
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
    const history = await prisma.recipeHistory.create({
      data: {
        suggestion: data.suggestion,
        options: JSON.stringify(data.options),
        ingredients: JSON.stringify(data.ingredients),
      },
    });

    // Parse the JSON strings back to objects for the response
    const parsedHistory = {
      ...history,
      options: JSON.parse(history.options),
      ingredients: JSON.parse(history.ingredients),
    };

    return NextResponse.json(parsedHistory);
  } catch (error) {
    console.error('Error creating recipe history:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe history' },
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