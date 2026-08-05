"use client";

import { useCallback, useRef, useState } from "react";
import { RecipeCard } from "./RecipeCard";
import type { DetectedIngredient, GeneratedRecipe, MatchedRecipe } from "@/lib/types";
import { compressImage, fetchJson } from "@/lib/api-client";

type Step = "upload" | "detecting" | "results";

export function IngredientScanner() {
  const [step, setStep] = useState<Step>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [detected, setDetected] = useState<DetectedIngredient[]>([]);
  const [matches, setMatches] = useState<MatchedRecipe[]>([]);
  const [generated, setGenerated] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualIngredients, setManualIngredients] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const processIngredients = useCallback(async (ingredientNames: string[]) => {
    const matchResult = await fetchJson<{ matches: MatchedRecipe[] }>(
      "/api/recipes/match",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientNames, preferSeasonal: true }),
      }
    );

    if ("error" in matchResult) {
      throw new Error(matchResult.error);
    }

    setMatches(matchResult.data.matches ?? []);

    const genResult = await fetchJson<{ recipe: GeneratedRecipe }>(
      "/api/recipes/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientNames }),
      }
    );

    if ("error" in genResult) {
      setGenerated(null);
      setError(
        `${genResult.error} FareShare recipe matches are still shown below.`
      );
    } else {
      setGenerated(genResult.data.recipe ?? null);
      setError(null);
    }

    setStep("results");
  }, []);

  const handleImage = useCallback(
    async (dataUrl: string) => {
      setPreview(dataUrl);
      setStep("detecting");
      setError(null);

      try {
        const compressed = await compressImage(dataUrl);
        setPreview(compressed);

        const result = await fetchJson<{ ingredients: DetectedIngredient[] }>(
          "/api/detect-ingredients",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: compressed }),
          }
        );

        if ("error" in result) {
          throw new Error(result.error);
        }

        setDetected(result.data.ingredients ?? []);
        const names = (result.data.ingredients ?? []).map((i) => i.name);
        if (names.length === 0) {
          setError("No ingredients detected. Try a clearer photo or add them manually.");
          setStep("upload");
          return;
        }
        await processIngredients(names);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setStep("upload");
      }
    },
    [processIngredients]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setError("Camera access denied. Please upload a photo instead.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    stopCamera();
    void handleImage(dataUrl);
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const names = manualIngredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) return;

    setDetected(
      names.map((name) => ({ name, confidence: 1, inSeason: false }))
    );
    setStep("detecting");
    setError(null);
    try {
      await processIngredients(names);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("upload");
    }
  };

  const reset = () => {
    setStep("upload");
    setPreview(null);
    setDetected([]);
    setMatches([]);
    setGenerated(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="space-y-8">
      {step === "upload" && (
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-center">
            {!cameraActive ? (
              <>
                <p className="mb-4 text-emerald-800">
                  Photograph your fruit, veg, or fridge contents — we&apos;ll identify
                  ingredients and suggest seasonal recipes.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Upload photo
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="rounded-full border border-emerald-600 px-6 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Use camera
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onFileChange}
                />
              </>
            ) : (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="mx-auto max-h-80 rounded-xl"
                />
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white"
                  >
                    Capture
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="rounded-full border border-emerald-300 px-6 py-3 text-sm text-emerald-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <label className="block text-sm font-medium text-emerald-900">
              Or type ingredients (comma-separated)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualIngredients}
                onChange={(e) => setManualIngredients(e.target.value)}
                placeholder="e.g. courgette, tomato, onion, basil"
                className="flex-1 rounded-xl border border-emerald-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Find recipes
              </button>
            </div>
          </form>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
        </div>
      )}

      {step === "detecting" && (
        <div className="flex flex-col items-center gap-4 py-16">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your ingredients" className="max-h-48 rounded-xl" />
          )}
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-emerald-700">Detecting ingredients and finding recipes…</p>
        </div>
      )}

      {step === "results" && (
        <div className="space-y-8">
          {error && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </p>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-emerald-950">Your ingredients</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {detected.map((ing) => (
                  <span
                    key={ing.name}
                    className={`rounded-full px-3 py-1 text-sm ${
                      ing.inSeason
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                    title={ing.seasonalNote}
                  >
                    {ing.name}
                    {ing.inSeason && " ✓ in season"}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm text-emerald-600 hover:underline"
            >
              Scan again
            </button>
          </div>

          {generated && (
            <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
                AI-generated recipe
              </p>
              <h3 className="text-2xl font-semibold text-emerald-950">{generated.title}</h3>
              <p className="mt-2 text-emerald-700">{generated.description}</p>
              <p className="mt-2 text-sm text-emerald-600">
                Prep: {generated.prepTime} · Cook: {generated.cookTime} · Serves{" "}
                {generated.servings}
              </p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-emerald-900">Ingredients</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-emerald-800">
                    {generated.ingredients.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-900">Method</h4>
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-emerald-800">
                    {generated.method.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
              {generated.seasonalTips.length > 0 && (
                <div className="mt-4 rounded-xl bg-emerald-100/60 p-4">
                  <h4 className="text-sm font-medium text-emerald-900">Seasonal tips</h4>
                  <ul className="mt-1 list-inside list-disc text-sm text-emerald-700">
                    {generated.seasonalTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {matches.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-emerald-950">
                Matching FareShare recipes ({matches.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    matchedIngredients={recipe.matchedIngredients}
                    matchScore={recipe.matchScore}
                  />
                ))}
              </div>
            </section>
          )}

          {matches.length === 0 && !generated && (
            <p className="text-emerald-700">
              No exact matches in the FareShare recipe library — try the AI-generated recipe
              above or add more ingredients.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
