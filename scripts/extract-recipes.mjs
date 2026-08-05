/**
 * Extracts all recipes from the FareShare WordPress REST API
 * and saves them to src/data/recipes.json
 *
 * Run: node scripts/extract-recipes.mjs
 */

import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_BASE = "https://fareshare.org.uk/wp-json/wp/v2";
const OUTPUT = join(__dirname, "../src/data/recipes.json");

function parseIngredients(html) {
  if (!html) return [];
  const $ = cheerio.load(html);
  return $("li")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
}

function parseTaxonomyFromClasses(classList, prefix) {
  return (classList || [])
    .filter((c) => c.startsWith(prefix))
    .map((c) => c.replace(prefix, "").replace(/-/g, " "));
}

function normalizeRecipe(raw) {
  const ingredients = parseIngredients(raw.ingredients_wysiwyg);
  const method = (raw.method || [])
    .map((m) => m.method_steps)
    .filter(Boolean);

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title?.rendered?.replace(/&#038;/g, "&").replace(/&amp;/g, "&") ?? "",
    link: raw.link,
    image: raw.featured_image_small || raw.featured_image || null,
    prepTime: raw.prep_time ? `${raw.prep_time} ${raw.prep_time_format || "minutes"}` : null,
    cookTime: raw.cook_time ? `${raw.cook_time} ${raw.cook_time_format || "minutes"}` : null,
    ingredients,
    method,
    diets: parseTaxonomyFromClasses(raw.class_list, "recipe-diet-"),
    difficulty: parseTaxonomyFromClasses(raw.class_list, "recipe-difficulty-")[0] ?? null,
    tags: parseTaxonomyFromClasses(raw.class_list, "recipe-ingredient-"),
    notes: raw.partner_paragraph
      ? cheerio.load(raw.partner_paragraph).text().trim()
      : null,
  };
}

async function fetchAllRecipes() {
  const recipes = [];
  let page = 1;

  while (true) {
    const url = `${API_BASE}/recipe?per_page=100&page=${page}&status=publish`;
    const res = await fetch(url);
    if (!res.ok) break;

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    recipes.push(...batch.map(normalizeRecipe));
    console.log(`Fetched page ${page}: ${batch.length} recipes (total: ${recipes.length})`);

    if (batch.length < 100) break;
    page++;
  }

  return recipes;
}

async function main() {
  console.log("Extracting recipes from FareShare...");
  const recipes = await fetchAllRecipes();
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(recipes, null, 2));
  console.log(`Saved ${recipes.length} recipes to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
