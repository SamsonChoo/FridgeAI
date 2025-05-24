import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RecipeHistoryEntry {
  id: string;
  timestamp: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    categories: Array<{ name: string }>;
  }>;
  suggestion: string;
  options: {
    dietaryRestrictions?: string;
    skillLevel?: string;
    cookingTime?: number;
    servings?: number;
    allowMissingIngredients?: boolean;
  };
}

interface RecipeHistoryProps {
  history: RecipeHistoryEntry[];
  onDelete: (id: string) => void;
}

export default function RecipeHistory({ history, onDelete }: RecipeHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isOpen ? 'Hide History' : 'View History'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recipe Suggestion History</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)] p-4">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No history yet</p>
              ) : (
                <div className="space-y-6">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                          <div className="mt-2">
                            <h3 className="font-medium">Ingredients Used:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {entry.ingredients.map((ing, idx) => (
                                <li key={idx}>
                                  {ing.name} ({ing.quantity} {ing.unit})
                                  {ing.categories.length > 0 && (
                                    <span className="text-gray-500">
                                      {' '}
                                      [{ing.categories.map((c) => c.name).join(', ')}]
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {entry.options.dietaryRestrictions && (
                            <p className="text-sm text-gray-600 mt-1">
                              Dietary Restrictions: {entry.options.dietaryRestrictions}
                            </p>
                          )}
                          {entry.options.servings && (
                            <p className="text-sm text-gray-600">
                              Servings: {entry.options.servings}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onDelete(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-4 bg-white p-4 rounded border">
                        <h4 className="font-medium mb-2">Suggestion:</h4>
                        <div className="prose prose-sm max-w-none">
                          {entry.suggestion.split('\n').map((line, idx) => (
                            <p key={idx} className="whitespace-pre-wrap">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 