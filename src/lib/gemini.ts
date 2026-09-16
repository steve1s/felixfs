import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-3.6-flash";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env.local and restart the dev server."
    );
  }
  return new GoogleGenAI({ apiKey });
}

export function parseDataUrl(image: string) {
  const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: "image/jpeg", data: image };
}

export async function generateGeminiJson<T>(
  systemInstruction: string,
  userText: string,
  image?: string
): Promise<T> {
  const ai = getGeminiClient();
  const parts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [{ text: userText }];

  if (image) {
    const { mimeType, data } = parseDataUrl(image);
    parts.push({ inlineData: { mimeType, data } });
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(content) as T;
}
