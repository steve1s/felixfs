export type ProduceItem = {
  name: string;
  type: "fruit" | "vegetable" | "herb";
  months: number[]; // 1-12
  peak?: number[];
};

/** British seasonal fruit & vegetables — Eat the Seasons / UK growing calendar */
export const SEASONAL_PRODUCE: ProduceItem[] = [
  { name: "Apples", type: "fruit", months: [9, 10, 11, 12, 1, 2], peak: [9, 10] },
  { name: "Asparagus", type: "vegetable", months: [4, 5, 6], peak: [5] },
  { name: "Aubergine", type: "vegetable", months: [7, 8, 9], peak: [8] },
  { name: "Beetroot", type: "vegetable", months: [6, 7, 8, 9, 10], peak: [9] },
  { name: "Blackberries", type: "fruit", months: [8, 9, 10], peak: [9] },
  { name: "Blueberries", type: "fruit", months: [7, 8, 9], peak: [8] },
  { name: "Broad beans", type: "vegetable", months: [6, 7, 8], peak: [7] },
  { name: "Broccoli", type: "vegetable", months: [6, 7, 8, 9, 10, 11], peak: [9, 10] },
  { name: "Brussels sprouts", type: "vegetable", months: [10, 11, 12, 1, 2], peak: [12] },
  { name: "Butternut squash", type: "vegetable", months: [9, 10, 11, 12], peak: [10] },
  { name: "Cabbage", type: "vegetable", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], peak: [11, 12] },
  { name: "Carrots", type: "vegetable", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], peak: [9, 10] },
  { name: "Cauliflower", type: "vegetable", months: [1, 2, 3, 4, 5, 9, 10, 11, 12], peak: [2, 3] },
  { name: "Celeriac", type: "vegetable", months: [9, 10, 11, 12, 1, 2, 3], peak: [11] },
  { name: "Cherries", type: "fruit", months: [6, 7], peak: [7] },
  { name: "Courgette", type: "vegetable", months: [6, 7, 8, 9], peak: [7, 8] },
  { name: "Cucumber", type: "vegetable", months: [6, 7, 8, 9], peak: [7, 8] },
  { name: "Damsons", type: "fruit", months: [9], peak: [9] },
  { name: "Fennel", type: "vegetable", months: [7, 8, 9, 10], peak: [9] },
  { name: "French beans", type: "vegetable", months: [7, 8, 9], peak: [8] },
  { name: "Garlic", type: "vegetable", months: [6, 7, 8], peak: [7] },
  { name: "Globe artichoke", type: "vegetable", months: [6, 7, 8], peak: [7] },
  { name: "Gooseberries", type: "fruit", months: [6, 7], peak: [7] },
  { name: "Kale", type: "vegetable", months: [1, 2, 3, 4, 9, 10, 11, 12], peak: [11, 12] },
  { name: "Kohlrabi", type: "vegetable", months: [6, 7, 8, 9], peak: [8] },
  { name: "Leeks", type: "vegetable", months: [9, 10, 11, 12, 1, 2, 3], peak: [12, 1] },
  { name: "Lettuce", type: "vegetable", months: [5, 6, 7, 8, 9], peak: [6, 7] },
  { name: "Mangetout", type: "vegetable", months: [6, 7, 8], peak: [7] },
  { name: "Marrow", type: "vegetable", months: [7, 8, 9, 10], peak: [8] },
  { name: "Nectarines", type: "fruit", months: [7, 8], peak: [8] },
  { name: "Onions", type: "vegetable", months: [7, 8, 9, 10, 11, 12, 1, 2, 3], peak: [9] },
  { name: "Parsnip", type: "vegetable", months: [9, 10, 11, 12, 1, 2, 3], peak: [12, 1] },
  { name: "Peas", type: "vegetable", months: [6, 7, 8], peak: [7] },
  { name: "Peppers", type: "vegetable", months: [7, 8, 9], peak: [8] },
  { name: "Plums", type: "fruit", months: [8, 9], peak: [9] },
  { name: "Potatoes", type: "vegetable", months: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3], peak: [9] },
  { name: "Pumpkin", type: "vegetable", months: [10, 11], peak: [10] },
  { name: "Radish", type: "vegetable", months: [5, 6, 7, 8, 9], peak: [6, 7] },
  { name: "Raspberries", type: "fruit", months: [6, 7, 8, 9], peak: [7, 8] },
  { name: "Rhubarb", type: "fruit", months: [4, 5, 6, 7], peak: [5] },
  { name: "Runner beans", type: "vegetable", months: [7, 8, 9], peak: [8] },
  { name: "Spinach", type: "vegetable", months: [4, 5, 6, 7, 8, 9, 10], peak: [5, 6] },
  { name: "Spring onions", type: "vegetable", months: [4, 5, 6, 7, 8, 9], peak: [6] },
  { name: "Strawberries", type: "fruit", months: [6, 7, 8], peak: [6, 7] },
  { name: "Swede", type: "vegetable", months: [9, 10, 11, 12, 1, 2], peak: [11] },
  { name: "Sweetcorn", type: "vegetable", months: [8, 9], peak: [9] },
  { name: "Tomatoes", type: "vegetable", months: [7, 8, 9], peak: [8] },
  { name: "Turnip", type: "vegetable", months: [9, 10, 11, 12, 1, 2], peak: [11] },
  { name: "Watercress", type: "vegetable", months: [4, 5, 6, 7, 8, 9], peak: [5] },
  { name: "Basil", type: "herb", months: [6, 7, 8, 9], peak: [7, 8] },
  { name: "Parsley", type: "herb", months: [4, 5, 6, 7, 8, 9, 10], peak: [6, 7] },
  { name: "Rosemary", type: "herb", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { name: "Sage", type: "herb", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { name: "Thyme", type: "herb", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function getInSeason(month = new Date().getMonth() + 1) {
  return SEASONAL_PRODUCE.filter((p) => p.months.includes(month));
}

export function getPeakSeason(month = new Date().getMonth() + 1) {
  return SEASONAL_PRODUCE.filter((p) => p.peak?.includes(month));
}

export function isInSeason(name: string, month = new Date().getMonth() + 1) {
  const item = SEASONAL_PRODUCE.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  return item ? item.months.includes(month) : false;
}

export function normalizeIngredient(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}
