'use client';

interface RecipeSuggestionProps {
  suggestion: string;
}

// RecipeSuggestion: Displays AI-generated recipe suggestions in a styled card
export default function RecipeSuggestion({ suggestion }: RecipeSuggestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600">
        <h2 className="text-base font-semibold text-white">Recipe Suggestions</h2>
      </div>
      {/* Suggestion content */}
      <div className="p-4">
        <div className="prose prose-sm max-w-none">
          {suggestion.split('\n').map((line, index) => {
            if (line.startsWith('#')) {
              return (
                <h3 key={index} className="text-base font-medium text-gray-900 mt-3 mb-2">
                  {line.replace(/^#+\s*/, '')}
                </h3>
              );
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return (
              <p key={index} className="text-sm text-gray-600 mb-1.5">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
} 