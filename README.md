# Seasonal Plate — FareShare

A web app that helps users cook with **British seasonal produce**, encouraging people to buy or receive in-season fruits and vegetables. Built for FareShare staff and the wider community fighting hunger and tackling food waste.

## Features

- **106 FareShare recipes** extracted from [fareshare.org.uk/recipes](https://fareshare.org.uk/recipes/)
- **British seasonal calendar** — see what's in season month by month
- **Ingredient scanning** — upload a photo or use your camera; Gemini detects ingredients
- **Recipe matching** — finds FareShare recipes that use what you have
- **AI recipe generation** — creates budget-friendly, seasonal meal ideas in FareShare's style

## Quick start

```bash
npm install
cp .env.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Refresh recipes from FareShare

Recipes are pulled from the public WordPress REST API:

```bash
npm run extract-recipes
```

This updates `src/data/recipes.json`.

## Project structure

```
src/
  app/
    api/detect-ingredients/   # Gemini Vision — object/ingredient detection
    api/recipes/match/        # Match detected ingredients to FareShare recipes
    api/recipes/generate/     # AI-generated seasonal recipe
    scan/                     # Camera / upload UI
    seasonal/                 # Monthly produce calendar
    recipes/                  # Browse & view recipes
  data/
    recipes.json              # Extracted FareShare recipes
    seasonal-produce.ts         # UK seasonal produce calendar
  components/
    IngredientScanner.tsx       # Camera + detection flow
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes (for scan/generate) | Google Gemini API key for Vision + recipe generation |

Browse and seasonal pages work without an API key. Scan and AI generation require it.

## Tech stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Google Gemini 2.5 Flash (vision + text)
- FareShare WordPress REST API for recipe data

## Notes for FareShare team

- Recipe data is sourced from the public API and attributed to fareshare.org.uk
- Re-run `npm run extract-recipes` when new recipes are published on the website
- The seasonal calendar uses a standard UK growing calendar; you may want to refine it with regional FareShare hub data
