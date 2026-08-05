import Link from "next/link";
import type { Recipe } from "@/lib/types";

export function RecipeCard({
  recipe,
  matchedIngredients,
  matchScore,
}: {
  recipe: Recipe;
  matchedIngredients?: string[];
  matchScore?: number;
}) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      {recipe.image && (
        <div className="aspect-[3/2] overflow-hidden bg-emerald-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-emerald-950 group-hover:text-emerald-700">
          {recipe.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {recipe.difficulty && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
              {recipe.difficulty}
            </span>
          )}
          {recipe.diets.map((d) => (
            <span
              key={d}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
            >
              {d}
            </span>
          ))}
        </div>
        {matchedIngredients && matchedIngredients.length > 0 && (
          <p className="text-xs text-emerald-600">
            Matches: {matchedIngredients.join(", ")}
            {matchScore !== undefined && (
              <span className="ml-1 text-emerald-400">
                ({Math.round(matchScore * 100)}%)
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
