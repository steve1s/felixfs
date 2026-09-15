import { enrichWithSeasonalContext } from "@/lib/recipes";
import { apiError, withApiHandler } from "@/lib/api-utils";
import { generateGeminiJson } from "@/lib/gemini";
import { getInSeason, MONTH_NAMES } from "@/data/seasonal-produce";
import type { DetectedIngredient } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return withApiHandler(async () => {
    if (!process.env.GEMINI_API_KEY) {
      return apiError(
        "GEMINI_API_KEY is not configured. Add it to .env.local and restart the dev server.",
        500
      );
    }

    let body: { image?: string };
    try {
      body = await req.json();
    } catch {
      return apiError(
        "Could not read request body. Try a smaller image or use manual ingredient entry.",
        413
      );
    }

    const { image } = body;
    if (!image) {
      return apiError("No image provided", 400);
    }

    const month = new Date().getMonth() + 1;
    const inSeasonNow = getInSeason(month)
      .map((p) => p.name)
      .join(", ");

    const parsed = await generateGeminiJson<{
      ingredients?: { name: string; confidence: number }[];
    }>(
      `You are a food ingredient detection assistant for a UK seasonal cooking app run by FareShare (a food redistribution charity).
Identify all visible fruits, vegetables, herbs, and other food ingredients in the image.
Focus on British produce where possible.
Current month: ${MONTH_NAMES[month - 1]}. Currently in season in the UK: ${inSeasonNow}.
Return ONLY valid JSON: { "ingredients": [{ "name": string, "confidence": number 0-1 }] }
Use common British English names (e.g. "courgette" not "zucchini", "aubergine" not "eggplant").`,
      "Identify all food ingredients visible in this image. Include fresh produce, packaged items, and anything that could be used in cooking.",
      image
    );

    const rawIngredients = parsed.ingredients ?? [];
    if (rawIngredients.length === 0) {
      return NextResponse.json({ ingredients: [], month });
    }

    const enriched: DetectedIngredient[] = enrichWithSeasonalContext(
      rawIngredients.map((i) => i.name),
      month
    ).map((item, idx) => ({
      name: item.name,
      confidence: rawIngredients[idx]?.confidence ?? 0.8,
      inSeason: item.inSeason,
      seasonalNote: item.seasonalNote,
    }));

    return NextResponse.json({ ingredients: enriched, month });
  });
}
