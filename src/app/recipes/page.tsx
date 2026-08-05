"use client";

import { useMemo, useState } from "react";
import { Header, Footer } from "@/components/Header";
import { RecipeCard } from "@/components/RecipeCard";
import { recipes, getAllIngredientTags } from "@/lib/recipes";

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [diet, setDiet] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const tags = useMemo(() => getAllIngredientTags(), []);
  const diets = useMemo(
    () => [...new Set(recipes.flatMap((r) => r.diets))].sort(),
    []
  );
  const difficulties = useMemo(
    () => [...new Set(recipes.map((r) => r.difficulty).filter(Boolean))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (ingredient && !r.tags.some((t) => t.toLowerCase() === ingredient.toLowerCase())) {
        return false;
      }
      if (diet && !r.diets.some((d) => d.toLowerCase() === diet.toLowerCase())) {
        return false;
      }
      if (difficulty && r.difficulty?.toLowerCase() !== difficulty.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [search, ingredient, diet, difficulty]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-emerald-950">FareShare recipes</h1>
        <p className="mt-2 text-emerald-700">
          {recipes.length} recipes extracted from{" "}
          <a
            href="https://fareshare.org.uk/recipes/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            fareshare.org.uk
          </a>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search recipes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-emerald-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <select
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="rounded-xl border border-emerald-200 px-3 py-2 text-sm"
          >
            <option value="">All ingredients</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="rounded-xl border border-emerald-200 px-3 py-2 text-sm"
          >
            <option value="">All diets</option>
            {diets.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-xl border border-emerald-200 px-3 py-2 text-sm"
          >
            <option value="">All difficulties</option>
            {difficulties.map((d) => (
              <option key={d} value={d!}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm text-emerald-600">
          Showing {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
