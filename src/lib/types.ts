export type Recipe = {
  id: number;
  slug: string;
  title: string;
  link: string;
  image: string | null;
  prepTime: string | null;
  cookTime: string | null;
  ingredients: string[];
  method: string[];
  diets: string[];
  difficulty: string | null;
  tags: string[];
  notes: string | null;
};

export type DetectedIngredient = {
  name: string;
  confidence: number;
  inSeason: boolean;
  seasonalNote?: string;
};

export type MatchedRecipe = Recipe & {
  matchScore: number;
  matchedIngredients: string[];
};

export type GeneratedRecipe = {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  method: string[];
  seasonalTips: string[];
  usesSurplus: boolean;
};
