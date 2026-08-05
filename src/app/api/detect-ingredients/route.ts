import OpenAI from "openai";
import { enrichWithSeasonalContext } from "@/lib/recipes";
import { apiError, withApiHandler } from "@/lib/api-utils";
import { getInSeason, MONTH_NAMES } from "@/data/seasonal-produce";
import type { DetectedIngredient } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return withApiHandler(async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return apiError(
        "OPENAI_API_KEY is not configured. Add it to .env.local and restart the dev server.",
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

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a food ingredient detection assistant for a UK seasonal cooking app run by FareShare (a food redistribution charity). 
Identify all visible fruits, vegetables, herbs, and other food ingredients in the image.
Focus on British produce where possible.
Current month: ${MONTH_NAMES[month - 1]}. Currently in season in the UK: ${inSeasonNow}.
Return ONLY valid JSON: { "ingredients": [{ "name": string, "confidence": number 0-1 }] }
Use common British English names (e.g. "courgette" not "zucchini", "aubergine" not "eggplant").`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify all food ingredients visible in this image. Include fresh produce, packaged items, and anything that could be used in cooking.",
            },
            {
              type: "image_url",
              image_url: { url: image, detail: "low" },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return apiError("No response from AI", 500);
    }

    let parsed: { ingredients?: { name: string; confidence: number }[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      return apiError("AI returned invalid data. Please try again.", 500);
    }

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
