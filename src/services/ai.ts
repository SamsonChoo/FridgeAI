import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

interface Category {
  id: number;
  name: string;
  description?: string | null;
}

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  categories: Category[];
  expirationDate?: string | null;
  addedDate?: string;
  updatedAt?: string;
}

const RECIPE_SUGGESTION_TEMPLATE = `Given the following ingredients in my fridge:
{ingredients}

Please suggest 3 recipes I can make with these ingredients.{allowMissingText} For each recipe:
1. List the ingredients needed and quantities
2. Provide step-by-step instructions
3. Mention any additional ingredients that might be needed but aren't in the list
4. Include approximate cooking time and difficulty level
5. Add any relevant tips or notes

Consider the following factors:
- Use ingredients that are expiring soon first
- Consider dietary restrictions: {dietaryRestrictions}
- Cooking skill level: {skillLevel}
- Available cooking time: {cookingTime} minutes
- Number of servings: {servings}

Other things to consider:
- Use ingredients, spices and condiments that can be easily found in Singapore
- Suggest healthy recipes for someone trying to lose weight and gain muscle

Format the response in a clear, easy-to-read way.`;

export async function getRecipeSuggestions(
  ingredients: Ingredient[],
  options: {
    dietaryRestrictions?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    cookingTime?: number;
    servings?: number;
    allowMissingIngredients?: boolean;
  } = {}
): Promise<string> {
  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const allowMissingText = options.allowMissingIngredients ? ' Include ingredients that are not available in my fridge if necessary, clearly mentioning them.' : ' Only use ingredients that are in my fridge.';

  const prompt = PromptTemplate.fromTemplate(RECIPE_SUGGESTION_TEMPLATE);

  const formattedIngredients = ingredients
    .map(
      (ing) =>
        `${ing.name} (${ing.quantity} ${ing.unit})${
          ing.categories && ing.categories.length > 0
            ? ' [' + ing.categories.map((c) => c.name).join(', ') + ']'
            : ''
        }${
          ing.expirationDate
            ? ` - expires on ${new Date(ing.expirationDate).toLocaleDateString()}`
            : ''
        }`
    )
    .join('\n');

  const formattedPrompt = await prompt.format({
    ingredients: formattedIngredients,
    dietaryRestrictions: options.dietaryRestrictions || 'none',
    skillLevel: options.skillLevel || 'beginner',
    cookingTime: options.cookingTime || 30,
    servings: options.servings || 2,
    allowMissingText: allowMissingText,
  });


  console.log('formattedPrompt', formattedPrompt);

  const response = await model.invoke(formattedPrompt);
  return response.content as string;
}

export async function getNutritionalInfo(ingredient: string) {
  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.3,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = PromptTemplate.fromTemplate(
    `Please provide nutritional information for {ingredient} per 100g. Include:
    - Calories
    - Protein
    - Carbohydrates
    - Fat
    - Fiber
    - Sugar
    - Sodium
    
    Format the response as a JSON object with these fields.`
  );

  const formattedPrompt = await prompt.format({
    ingredient,
  });

  const response = await model.invoke(formattedPrompt);
  return JSON.parse(response.content as string);
} 