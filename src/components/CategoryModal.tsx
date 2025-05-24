'use client';

import { useState } from 'react';
import type { Category } from '@/services/db';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (data: { name: string; description?: string }) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAdding(true);
    try {
      await onAddCategory({
        name: newCategoryName,
        description: newCategoryDescription,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setDeletingId(id);
    try {
      await onDeleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add New Category */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Category</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="newCategoryName"
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Category name"
              />
            </div>
            <div>
              <label htmlFor="newCategoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                id="newCategoryDescription"
                type="text"
                value={newCategoryDescription}
                onChange={e => setNewCategoryDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Category description"
              />
            </div>
            <button
              onClick={handleAddCategory}
              disabled={isAdding || !newCategoryName.trim()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </div>

        {/* Existing Categories */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Existing Categories</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories added yet.</p>
          ) : (
            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {categories.map((category) => (
                <li key={category.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={deletingId === category.id}
                    className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                  >
                    {deletingId === category.id ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 