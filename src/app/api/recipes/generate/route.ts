import OpenAI from "openai";
import { apiError, withApiHandler } from "@/lib/api-utils";
import { getInSeason, MONTH_NAMES } from "@/data/seasonal-produce";
import { recipes } from "@/lib/recipes";
import type { GeneratedRecipe } from "@/lib/types";
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

    let body: { ingredients?: string[] };
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request body", 400);
    }

    const { ingredients } = body;
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return apiError("Provide an array of ingredient names", 400);
    }

    const month = new Date().getMonth() + 1;
    const inSeason = getInSeason(month).map((p) => p.name);
    const sampleTitles = recipes
      .slice(0, 8)
      .map((r) => r.title)
      .join(", ");

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a recipe creator for FareShare, a UK food redistribution charity that fights hunger and tackles food waste.
Create cost-effective, accessible recipes using surplus and seasonal British ingredients.
Style inspiration from existing FareShare recipes: ${sampleTitles}.
Current month: ${MONTH_NAMES[month - 1]}. In season now: ${inSeason.join(", ")}.
Prioritise ingredients the user has. Use British measurements and terminology.
Return ONLY valid JSON matching this schema:
{
  "title": string,
  "description": string,
  "prepTime": string,
  "cookTime": string,
  "servings": number,
  "ingredients": string[],
  "method": string[],
  "seasonalTips": string[],
  "usesSurplus": boolean
}`,
        },
        {
          role: "user",
          content: `Create a recipe using these ingredients: ${ingredients.join(", ")}. 
Encourage using seasonal British produce where possible. Keep it simple and budget-friendly.`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return apiError("No response from AI", 500);
    }

    let recipe: GeneratedRecipe;
    try {
      recipe = JSON.parse(content) as GeneratedRecipe;
    } catch {
      return apiError("AI returned invalid recipe data. Please try again.", 500);
    }

    return NextResponse.json({ recipe });
  });
}
