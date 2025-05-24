'use client';

import { useState, useEffect } from 'react';
import IngredientCard from '@/components/IngredientCard';
import AddIngredientModal from '@/components/AddIngredientModal';
import RecipeSuggestion from '@/components/RecipeSuggestion';
import RecipeHistory from '@/components/RecipeHistory';
import { getIngredients, getCategories, deleteIngredient, createCategory, deleteCategory, Ingredient, Category } from '@/services/db';
import './globals.css';
import CategoryModal from '@/components/CategoryModal';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface RecipeHistoryEntry {
  id: string;
  timestamp: string;
  ingredients: Ingredient[];
  suggestion: string;
  options: {
    dietaryRestrictions?: string;
    skillLevel?: string;
    cookingTime?: number;
    servings?: number;
    allowMissingIngredients?: boolean;
  };
}

export default function Home() {
  // State for ingredients, categories, modal, suggestions, and loading
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [servings, setServings] = useState(2);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [allowMissingIngredients, setAllowMissingIngredients] = useState(false);
  const [recipeHistory, setRecipeHistory] = useState<RecipeHistoryEntry[]>([]);
  const router = useRouter();

  // Load data on mount
  useEffect(() => {
    loadData();
    loadHistory();
  }, []);

  // Fetch ingredients and categories
  const loadData = async () => {
    const [ingredientsData, categoriesData] = await Promise.all([
      getIngredients(),
      getCategories(),
    ]);
    setIngredients(ingredientsData);
    setCategories(categoriesData);
  };

  // Load recipe history
  const loadHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setRecipeHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Handle adding a new ingredient
  const handleAddIngredient = async () => {
    await loadData();
    setIsModalOpen(false);
    setEditingIngredient(null);
  };

  // Handle adding a new category
  const handleAddCategory = async (data: { name: string; description?: string }) => {
    await createCategory(data);
    await loadData(); // Reload categories after adding
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id: number) => {
    await deleteCategory(id);
    await loadData(); // Reload categories after deleting
  };

  // Handle deleting an ingredient
  const handleDeleteIngredient = async (id: number) => {
    await deleteIngredient(id);
    await loadData();
  };

  // Handle getting recipe suggestions
  const handleGetSuggestions = async () => {
    if (ingredients.length === 0) {
      alert('Please add some ingredients first!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          options: {
            dietaryRestrictions,
            servings,
            allowMissingIngredients,
          },
        }),
      });
      if (!response.ok) throw new Error('Failed to get suggestions');
      const data = await response.json();
      setSuggestions(data.suggestion);

      // Add to history in database
      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestion: data.suggestion,
          ingredients,
          options: {
            dietaryRestrictions,
            servings,
            allowMissingIngredients,
          },
        }),
      });
      if (!historyResponse.ok) throw new Error('Failed to save history');
      await loadHistory(); // Reload history after adding
    } catch (error) {
      console.error('Error getting suggestions:', error);
      alert('Failed to get recipe suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSuggestion = () => {
    setSuggestions('');
  };

  const handleDeleteHistoryEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete history entry');
      await loadHistory(); // Reload history after deleting
    } catch (error) {
      console.error('Error deleting history entry:', error);
      alert('Failed to delete history entry. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Smart Fridge</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Ingredient
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Manage Categories
            </button>
          </div>
        </div>

        {/* Empty state */}
        {ingredients.length === 0 ? (
          <section className="text-center py-8">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No ingredients</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first ingredient.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-1.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Ingredient
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Ingredient grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {ingredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.id}
                  name={ingredient.name}
                  quantity={ingredient.quantity}
                  unit={ingredient.unit}
                  categories={ingredient.categories}
                  expirationDate={ingredient.expirationDate}
                  onDelete={() => handleDeleteIngredient(ingredient.id)}
                  onEdit={() => {
                    setEditingIngredient(ingredient);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </section>

            {/* Get suggestions button */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Get Recipe Suggestions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Restrictions
                    </label>
                    <input
                      type="text"
                      value={dietaryRestrictions}
                      onChange={(e) => setDietaryRestrictions(e.target.value)}
                      placeholder="e.g., vegetarian, gluten-free"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Servings
                    </label>
                    <input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={allowMissingIngredients}
                        onChange={(e) => setAllowMissingIngredients(e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">
                        Allow missing ingredients
                      </span>
                    </label>
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={handleGetSuggestions}
                      disabled={isLoading}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : 'Get Suggestions'}
                    </button>
                    {suggestions && (
                      <button
                        onClick={handleClearSuggestion}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                {suggestions && <RecipeSuggestion suggestion={suggestions} />}
              </div>
            </div>
          </>
        )}
      </div>

      <RecipeHistory
        history={recipeHistory}
        onDelete={handleDeleteHistoryEntry}
      />

      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIngredient(null);
        }}
        categories={categories}
        onAdd={loadData}
        editingIngredient={editingIngredient}
      />

      {/* Category management modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </main>
  );
}
