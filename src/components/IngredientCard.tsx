'use client';

import { format } from 'date-fns';
import type { Category } from '@/services/db';

interface IngredientCardProps {
  name: string;
  quantity: number;
  unit: string;
  categories: Category[];
  expirationDate?: string | null;
  onDelete: () => void;
  onEdit: () => void;
}

// QuantityInfo: Shows the weighing scale icon and quantity/unit
function QuantityInfo({ quantity, unit }: { quantity: number; unit: string }) {
  return (
    <span className="flex items-center gap-1 text-sm text-gray-600">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
      <span className="font-medium">{quantity} {unit}</span>
    </span>
  );
}

// ExpirationInfo: Shows the expiration icon and date
function ExpirationInfo({ expDate, isExpiringSoon }: { expDate: Date; isExpiringSoon: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <svg
        className={`w-4 h-4 flex-shrink-0 ${isExpiringSoon ? 'text-red-500' : 'text-gray-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className={`text-xs font-medium ${isExpiringSoon ? 'text-red-600' : 'text-gray-600'}`}>
        Expires: {format(expDate, 'MMM d, yyyy')}
      </span>
    </span>
  );
}

// IngredientCard: Displays a single ingredient with actions and multiple category tags
export default function IngredientCard({
  name,
  quantity,
  unit,
  categories,
  expirationDate,
  onDelete,
  onEdit,
}: IngredientCardProps) {
  const expDate = expirationDate ? new Date(expirationDate) : undefined;
  const isExpiringSoon = expDate
    ? expDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 max-w-xs w-full mx-auto">
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-1">{name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {categories.map((cat) => (
                <span key={cat.id} className="inline-block px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Edit ingredient"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Delete ingredient"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Quantity info */}
        <QuantityInfo quantity={quantity} unit={unit} />
        {/* Expiration info */}
        {expDate && <ExpirationInfo expDate={expDate} isExpiringSoon={isExpiringSoon} />}
      </div>
    </div>
  );
} 