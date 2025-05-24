/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Ingredient` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "IngredientCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ingredientId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "IngredientCategory_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IngredientCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingredient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "expirationDate" DATETIME,
    "addedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nutritionalInfo" TEXT
);
INSERT INTO "new_Ingredient" ("addedDate", "expirationDate", "id", "name", "nutritionalInfo", "quantity", "unit", "updatedAt") SELECT "addedDate", "expirationDate", "id", "name", "nutritionalInfo", "quantity", "unit", "updatedAt" FROM "Ingredient";
DROP TABLE "Ingredient";
ALTER TABLE "new_Ingredient" RENAME TO "Ingredient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_ingredientId_categoryId_key" ON "IngredientCategory"("ingredientId", "categoryId");
