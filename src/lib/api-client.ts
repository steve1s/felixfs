export async function parseJsonResponse<T = unknown>(
  res: Response
): Promise<{ data: T | null; error: string | null }> {
  const text = await res.text();

  if (!text.trim()) {
    return {
      data: null,
      error: res.ok
        ? "Empty response from server"
        : `Server error (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`,
    };
  }

  try {
    return { data: JSON.parse(text) as T, error: null };
  } catch {
    return {
      data: null,
      error: res.ok
        ? "Invalid JSON from server"
        : `Server error (${res.status}): ${text.slice(0, 200)}`,
    };
  }
}

export async function fetchJson<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ data: T; res: Response } | { error: string; res: Response }> {
  const res = await fetch(input, init);
  const parsed = await parseJsonResponse<T>(res);

  if (parsed.error) {
    const payload = parsed.data as { error?: string } | null;
    return {
      error: payload?.error ?? parsed.error,
      res,
    };
  }

  if (!res.ok) {
    const payload = parsed.data as { error?: string } | null;
    return {
      error: payload?.error ?? `Request failed (${res.status})`,
      res,
    };
  }

  return { data: parsed.data as T, res };
}

/** Resize/compress image before upload to stay under API body limits */
export async function compressImage(
  dataUrl: string,
  maxWidth = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = dataUrl;
  });
}
