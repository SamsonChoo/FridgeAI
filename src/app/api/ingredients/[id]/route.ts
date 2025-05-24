import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  });
  if (!ingredient) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({
    ...ingredient,
    categories: ingredient.categories.map((ic: any) => ic.category),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const data = await request.json();
  try {
    // Update ingredient fields
    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        name: data.name,
        quantity: data.quantity,
        unit: data.unit,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        // Remove all old categories and set new ones
        categories: {
          deleteMany: {},
          create: data.categoryIds.map((categoryId: number) => ({ category: { connect: { id: categoryId } } })),
        },
      },
      include: { categories: { include: { category: true } } },
    });
    console.log('updated!');
    console.log(updated);
    return NextResponse.json({
      ...updated,
      categories: updated.categories.map((ic: any) => ic.category),
    });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  try {
    await prisma.ingredient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
  }
} 