import { NextResponse } from "next/server";

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function withApiHandler(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (err) {
    console.error("API error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return apiError(message);
  }
}
