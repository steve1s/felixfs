import { Header, Footer } from "@/components/Header";
import { ProduceChip } from "@/components/ProduceChip";
import { RecipeCard } from "@/components/RecipeCard";
import { getInSeason, getPeakSeason, MONTH_NAMES } from "@/data/seasonal-produce";
import { recipes } from "@/lib/recipes";
import Link from "next/link";

export default function Home() {
  const month = new Date().getMonth() + 1;
  const inSeason = getInSeason(month);
  const peak = getPeakSeason(month);
  const featured = recipes.slice(0, 6);

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-emerald-600 to-emerald-700 px-4 py-16 text-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-emerald-200">FareShare Seasonal Plate</p>
            <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Cook with British seasonal produce
            </h1>
            <p className="mt-4 max-w-xl text-lg text-emerald-100">
              Scan what you have, discover what&apos;s in season, and find cost-effective
              recipes from FareShare — fighting hunger and tackling food waste.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/scan"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Scan your ingredients
              </Link>
              <Link
                href="/seasonal"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                What&apos;s in season
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-950">
                In season this {MONTH_NAMES[month - 1]}
              </h2>
              <p className="mt-1 text-sm text-emerald-600">
                Click an ingredient to see matching recipes
                {peak.length > 0 && (
                  <>
                    {" · "}At peak now: {peak.map((p) => p.name).join(", ")}
                  </>
                )}
              </p>
            </div>
            <Link href="/seasonal" className="text-sm text-emerald-600 hover:underline">
              Full calendar →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {inSeason.map((item) => (
              <ProduceChip
                key={item.name}
                name={item.name}
                peak={item.peak?.includes(month)}
              />
            ))}
          </div>
        </section>

        <section className="bg-emerald-50/50 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold text-emerald-950">
                FareShare recipes
              </h2>
              <Link href="/recipes" className="text-sm text-emerald-600 hover:underline">
                Browse all {recipes.length} →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Scan ingredients",
                desc: "Use your camera or upload a photo. AI identifies what's in your fridge or shopping bag.",
              },
              {
                title: "Eat seasonally",
                desc: "See what's growing in Britain right now — better flavour, lower cost, less waste.",
              },
              {
                title: "Cook FareShare recipes",
                desc: "106 surplus-food recipes from fareshare.org.uk, matched to what you have.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-emerald-100 bg-white p-6"
              >
                <h3 className="font-semibold text-emerald-950">{item.title}</h3>
                <p className="mt-2 text-sm text-emerald-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
