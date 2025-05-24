'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Category } from '@/services/db';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  categoryIds: z.array(z.number().min(1, 'Category is required')).optional(),
  expirationDate: z.string().optional(),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  categories: Category[];
  editingIngredient?: any;
}

// FormField: A reusable component for labeled input fields with error display
function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// AddIngredientModal: Modal for adding a new ingredient (multi-category support)
export default function AddIngredientModal({
  isOpen,
  onClose,
  onAdd,
  categories,
  editingIngredient,
}: AddIngredientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: '',
      quantity: 0,
      unit: '',
      categoryIds: [],
      expirationDate: undefined,
    },
  });

  // Prefill form when editingIngredient changes
  useEffect(() => {
    if (editingIngredient) {
      reset({
        name: editingIngredient.name,
        quantity: editingIngredient.quantity,
        unit: editingIngredient.unit,
        categoryIds: editingIngredient.categories.map((c: any) => c.id),
        expirationDate: editingIngredient.expirationDate ? editingIngredient.expirationDate.slice(0, 10) : undefined,
      });
    } else {
      reset({
        name: '',
        quantity: 0,
        unit: '',
        categoryIds: [],
        expirationDate: undefined,
      });
    }
  }, [editingIngredient, reset, isOpen]);

  // Handles form submission
  const onSubmit = async (data: IngredientFormData) => {
    setIsSubmitting(true);
    try {
      const categoryIds = Array.isArray(data.categoryIds)
        ? data.categoryIds.map((id) => Number(id))
        : data.categoryIds ? [Number(data.categoryIds)] : [];
      const payload = { ...data, categoryIds };
      let response;
      if (editingIngredient) {
        response = await fetch(`/api/ingredients/${editingIngredient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) throw new Error('Failed to save ingredient');
      reset();
      onAdd();
    } catch (error) {
      console.error('Error saving ingredient:', error);
      alert('Failed to save ingredient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</h2>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name field */}
          <FormField label="Name" error={errors.name?.message}>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter ingredient name"
            />
          </FormField>

          {/* Quantity and Unit fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Quantity" error={errors.quantity?.message}>
              <input
                type="number"
                step="0.1"
                {...register('quantity', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.0"
              />
            </FormField>
            <FormField label="Unit" error={errors.unit?.message}>
              <input
                type="text"
                {...register('unit')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., kg, g, ml"
              />
            </FormField>
          </div>

          {/* Multi-category field */}
          <FormField label="Categories (optional, search to filter)" error={errors.categoryIds?.message}>
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => {
                const filteredCategories = categories.filter(cat =>
                  cat.name.toLowerCase().includes(categorySearch.toLowerCase())
                );
                const value = Array.isArray(field.value) ? field.value : [];
                return (
                  <Listbox value={value} onChange={field.onChange} multiple>
                    {({ open }: { open: boolean }) => (
                      <div className="relative">
                        <Listbox.Button className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                          <span className="flex flex-wrap gap-1">
                            {value.length === 0 ? (
                              <span className="text-gray-400">Select categories...</span>
                            ) : (
                              value.map((id: number) => {
                                const cat = categories.find((c) => c.id === id);
                                return cat ? (
                                  <span key={cat.id} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                                    {cat.name}
                                  </span>
                                ) : null;
                              })
                            )}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {/* Search input inside dropdown */}
                          <div className="sticky top-0 z-10 bg-white px-2 py-1 border-b border-gray-100">
                            <input
                              ref={searchInputRef}
                              type="text"
                              value={categorySearch}
                              onChange={e => setCategorySearch(e.target.value)}
                              placeholder="Search categories..."
                              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                          {filteredCategories.length === 0 ? (
                            <div className="px-4 py-2 text-gray-400">No categories found</div>
                          ) : (
                            filteredCategories.map((category) => (
                              <Listbox.Option
                                key={category.id}
                                value={category.id}
                                className={({ active, selected }) =>
                                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{category.name}</span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))
                          )}
                        </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                );
              }}
            />
          </FormField>

          {/* Expiration Date field */}
          <FormField label="Expiration Date (optional)">
            <input
              type="date"
              {...register('expirationDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </FormField>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (editingIngredient ? 'Updating...' : 'Adding...') : (editingIngredient ? 'Update Ingredient' : 'Add Ingredient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 