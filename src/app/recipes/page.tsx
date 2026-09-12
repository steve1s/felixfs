import { Header, Footer } from "@/components/Header";
import { RecipesBrowser } from "@/components/RecipesBrowser";
import { recipes } from "@/lib/recipes";

export const metadata = {
  title: "Recipes | Seasonal Plate",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ ingredient?: string }>;
}) {
  const { ingredient = "" } = await searchParams;

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
        <RecipesBrowser key={ingredient} initialIngredient={ingredient} />
      </main>
      <Footer />
    </>
  );
}
