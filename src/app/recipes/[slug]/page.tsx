import { Header, Footer } from "@/components/Header";
import { getRecipeBySlug } from "@/lib/recipes";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { recipes } = await import("@/lib/recipes");
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  return { title: recipe ? `${recipe.title} | Seasonal Plate` : "Recipe not found" };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/recipes" className="text-sm text-emerald-600 hover:underline">
          ← All recipes
        </Link>

        {recipe.image && (
          <div className="mt-4 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-6 text-3xl font-bold text-emerald-950">{recipe.title}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.difficulty && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
              {recipe.difficulty}
            </span>
          )}
          {recipe.diets.map((d) => (
            <span
              key={d}
              className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-800"
            >
              {d}
            </span>
          ))}
          {recipe.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
            >
              {t}
            </span>
          ))}
        </div>

        {(recipe.prepTime || recipe.cookTime) && (
          <p className="mt-4 text-sm text-emerald-600">
            {recipe.prepTime && `Prep: ${recipe.prepTime}`}
            {recipe.prepTime && recipe.cookTime && " · "}
            {recipe.cookTime && `Cook: ${recipe.cookTime}`}
          </p>
        )}

        {recipe.notes && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            {recipe.notes}
          </p>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-emerald-950">Ingredients</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-emerald-800">
              {recipe.ingredients.map((ing) => (
                <li key={ing}>{ing}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-emerald-950">Method</h2>
            <ol className="mt-3 list-inside list-decimal space-y-3 text-emerald-800">
              {recipe.method.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <a
          href={recipe.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-sm text-emerald-600 hover:underline"
        >
          View original on fareshare.org.uk →
        </a>
      </main>
      <Footer />
    </>
  );
}
