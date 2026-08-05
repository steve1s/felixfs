import { Header, Footer } from "@/components/Header";
import { IngredientScanner } from "@/components/IngredientScanner";

export const metadata = {
  title: "Scan ingredients | Seasonal Plate",
};

export default function ScanPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-emerald-950">Scan your ingredients</h1>
        <p className="mt-2 text-emerald-700">
          Photograph your produce and we&apos;ll detect ingredients, check what&apos;s in
          season, and suggest FareShare recipes plus an AI-generated meal idea.
        </p>
        <div className="mt-8">
          <IngredientScanner />
        </div>
      </main>
      <Footer />
    </>
  );
}
