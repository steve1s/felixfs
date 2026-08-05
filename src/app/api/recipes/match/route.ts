import { matchRecipes } from "@/lib/recipes";
import { apiError, withApiHandler } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return withApiHandler(async () => {
    let body: { ingredients?: string[]; preferSeasonal?: boolean };
    try {
      body = await req.json();
    } catch {
      return apiError("Invalid request body", 400);
    }

    const { ingredients, preferSeasonal = true } = body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return apiError("Provide an array of ingredient names", 400);
    }

    const matches = matchRecipes(ingredients, { preferSeasonal });

    return NextResponse.json({ matches: matches.slice(0, 12) });
  });
}
