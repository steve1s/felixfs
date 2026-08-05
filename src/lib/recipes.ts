import recipesData from "@/data/recipes.json";
import { normalizeIngredient, isInSeason, SEASONAL_PRODUCE } from "@/data/seasonal-produce";
import type { MatchedRecipe, Recipe } from "./types";

export const recipes = recipesData as Recipe[];

function ingredientTokens(text: string): string[] {
  return normalizeIngredient(text)
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function matchesIngredient(recipeText: string, detected: string): boolean {
  const normDetected = normalizeIngredient(detected);
  const normRecipe = normalizeIngredient(recipeText);

  if (normRecipe.includes(normDetected) || normDetected.includes(normRecipe)) {
    return true;
  }

  const detectedTokens = ingredientTokens(detected);
  const recipeTokens = ingredientTokens(recipeText);

  return detectedTokens.some((dt) =>
    recipeTokens.some((rt) => rt.includes(dt) || dt.includes(rt))
  );
}

function tagMatches(detected: string, tags: string[]): boolean {
  const norm = normalizeIngredient(detected);
  return tags.some((tag) => {
    const normTag = normalizeIngredient(tag);
    return normTag.includes(norm) || norm.includes(normTag);
  });
}

export function matchRecipes(
  detectedIngredients: string[],
  options?: { preferSeasonal?: boolean; month?: number }
): MatchedRecipe[] {
  const month = options?.month ?? new Date().getMonth() + 1;

  return recipes
    .map((recipe) => {
      const matched: string[] = [];

      for (const detected of detectedIngredients) {
        const inIngredients = recipe.ingredients.some((ing) =>
          matchesIngredient(ing, detected)
        );
        const inTags = tagMatches(detected, recipe.tags);

        if (inIngredients || inTags) {
          matched.push(detected);
        }
      }

      if (matched.length === 0) return null;

      let score = matched.length / detectedIngredients.length;

      if (options?.preferSeasonal) {
        const seasonalMatches = matched.filter((m) => isInSeason(m, month));
        score += seasonalMatches.length * 0.15;
      }

      return {
        ...recipe,
        matchScore: Math.min(score, 1),
        matchedIngredients: matched,
      };
    })
    .filter((r): r is MatchedRecipe => r !== null)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getRecipeBySlug(slug: string) {
  return recipes.find((r) => r.slug === slug);
}

export function getAllIngredientTags() {
  const tags = new Set<string>();
  recipes.forEach((r) => r.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

export function enrichWithSeasonalContext(ingredients: string[], month = new Date().getMonth() + 1) {
  return ingredients.map((name) => {
    const produce = SEASONAL_PRODUCE.find(
      (p) =>
        normalizeIngredient(p.name).includes(normalizeIngredient(name)) ||
        normalizeIngredient(name).includes(normalizeIngredient(p.name))
    );
    const inSeason = produce ? produce.months.includes(month) : false;
    const peak = produce?.peak?.includes(month) ?? false;

    return {
      name,
      inSeason,
      peak,
      seasonalNote: produce
        ? peak
          ? `${produce.name} is at peak season in the UK right now — great value and flavour!`
          : inSeason
            ? `${produce.name} is in season in the UK.`
            : `${produce.name} is not typically in season — consider a swap from what's available locally.`
        : undefined,
    };
  });
}
