import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Return only the base64 part, removing the data URI scheme prefix
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function urlToBase64(url: string): Promise<{ mimeType: string, data: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const matches = result.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches) return reject(new Error('Invalid base64'));
      resolve({ mimeType: matches[1], data: matches[2] });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
