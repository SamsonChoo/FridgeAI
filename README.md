# Fridge AI - Smart Food Suggestions

A web application that helps you manage your ingredients and get AI-powered recipe suggestions based on what you have in your fridge.

## Features

- Track ingredients with quantities, categories, and expiration dates
- Get AI-powered recipe suggestions based on available ingredients
- View nutritional information for ingredients
- Responsive design for both desktop and mobile
- Easy-to-use interface for managing your ingredients

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- LangChain with OpenAI GPT-3.5
- SQLite with Prisma
- React Hook Form with Zod validation

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd food-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Add ingredients to your fridge by clicking the "Add Ingredient" button
2. Fill in the ingredient details (name, quantity, unit, category, expiration date)
3. Click "Get Suggestions" to receive AI-powered recipe suggestions
4. View nutritional information for ingredients
5. Manage your ingredients by editing or removing them as needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
