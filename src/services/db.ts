// Local types matching API response
export interface Category {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  categories: Category[];
  expirationDate?: string | null;
  addedDate?: string;
  updatedAt?: string;
  nutritionalInfo?: string | null;
}

export async function getIngredients(): Promise<Ingredient[]> {
  const response = await fetch('/api/ingredients');
  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function createIngredient(data: {
  name: string;
  quantity: number;
  unit: string;
  categoryIds: number[];
  expirationDate?: string;
}): Promise<Ingredient> {
  const response = await fetch('/api/ingredients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create ingredient');
  }

  return response.json();
}

export async function deleteIngredient(id: number): Promise<void> {
  const response = await fetch(`/api/ingredients?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete ingredient');
  }
}

export async function createCategory(data: {
  name: string;
  description?: string;
}): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create category');
  }

  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`/api/categories?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}

export async function updateIngredient(
  id: number,
  data: {
    name?: string;
    quantity?: number;
    unit?: string;
    categoryIds?: number[];
    expirationDate?: string;
  }
): Promise<Ingredient> {
  const response = await fetch(`/api/ingredients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update ingredient');
  }

  return response.json();
}

export async function getIngredientHistory(ingredientId: number) {
  const response = await fetch(`/api/ingredients/${ingredientId}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch ingredient history');
  }
  return response.json();
} 