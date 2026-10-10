import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const blobUrlCache = new Map<string, string>();

/**
 * Converts heavy base64 video data URLs into native browser Blob URLs.
 * Native Blob URLs stream through hardware video decoders without allocating
 * massive strings on the JavaScript main thread, preventing UI lag and black screens on PC.
 */
export function getSafeMediaUrl(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (!src.startsWith('data:video/')) return src;
  if (blobUrlCache.has(src)) return blobUrlCache.get(src);

  try {
    const parts = src.split(',');
    const header = parts[0];
    const base64Data = parts[1];
    if (!base64Data) return src;

    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'video/mp4';

    const binary = atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    blobUrlCache.set(src, blobUrl);
    return blobUrl;
  } catch (err) {
    console.warn('Failed to convert base64 video to blob URL:', err);
    return src;
  }
}
