import { GoogleGenAI } from '@google/genai';

// ─── Key pool (all 3 keys from .env) ──────────────────────────────────────────
const GEMINI_KEYS = [
  import.meta.env.VITE_GEMINI_KEY_1,
  import.meta.env.VITE_GEMINI_KEY_2,
  import.meta.env.VITE_GEMINI_KEY_3,
].filter(Boolean) as string[];

// Round-robin index persisted at module level so each import shares state
let _idx = 0;

/** Returns a fresh GoogleGenAI client using the next available key */
export function nextGeminiClient(): GoogleGenAI {
  if (GEMINI_KEYS.length === 0) throw new Error('No Gemini API keys configured');
  const key = GEMINI_KEYS[_idx % GEMINI_KEYS.length];
  _idx = (_idx + 1) % GEMINI_KEYS.length;
  return new GoogleGenAI({ apiKey: key });
}

/**
 * Runs `fn` with rotating Gemini clients — on a 429/quota error it
 * immediately retries with the next key, cycling through all available keys.
 */
export async function withGeminiRotation<T>(
  fn: (client: GoogleGenAI) => Promise<T>,
  maxAttempts = GEMINI_KEYS.length * 2, // try each key twice before giving up
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const client = nextGeminiClient();
    try {
      return await fn(client);
    } catch (err: any) {
      const msg: string = (err?.message ?? '').toLowerCase();
      const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('rate limit');
      if (isQuota) {
        lastError = err;
        continue; // rotate to next key
      }
      throw err; // non-quota error — propagate immediately
    }
  }
  throw lastError ?? new Error('All Gemini API keys exhausted (quota exceeded on all keys)');
}

/**
 * Converts a remote image URL to a base64 string.
 * Uses canvas+crossOrigin first (works on iOS Safari), falls back to fetch.
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  // Method 1: img + canvas — already cached by browser, CORS-safe on iOS
  try {
    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => reject(new Error('img load timeout')), 8000);
      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 400;
          canvas.height = img.naturalHeight || 400;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('no canvas context');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.88).split(',')[1]);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      // Bust cache to force a fresh CORS request with crossOrigin header
      img.src = url.includes('?') ? `${url}&_cb=${Date.now()}` : `${url}?_cb=${Date.now()}`;
    });
  } catch {
    // Method 2: fetch — fallback for desktop browsers where canvas might be tainted
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
