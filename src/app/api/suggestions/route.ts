import { NextResponse } from 'next/server';
import { getRecipeSuggestions } from '@/services/ai';

export async function POST(request: Request) {
  try {
    const { ingredients, options } = await request.json();
    const suggestion = await getRecipeSuggestions(ingredients, options);
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Error generating recipe suggestion:', error);
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
  }
} 