import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 Credentials & Endpoints
const R2_ACCOUNT_ID = 'de694b670c435db712fc4d358b3db44b';
const R2_ACCESS_KEY_ID = '7875e9ad88c85aa76712f53dc0956656';
const R2_SECRET_ACCESS_KEY = '299b034833e282b878fe200ec115766d38c3f3dab5cef288ebbb458550c60549';
export const R2_BUCKET_NAME = 'prompt-videos';
export const R2_PUBLIC_BASE_URL = 'https://pub-56963dfb15bd4eb2a9cc52b9c62aedcf.r2.dev';

// S3-compatible client targeting Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a video file directly to Cloudflare R2 bucket.
 * Returns the public streaming CDN URL.
 */
export async function uploadVideoToR2(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop() || 'mp4';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `prompts/${Date.now()}_${cleanFileName}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    if (onProgress) onProgress(30);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: uint8Array,
      ContentType: file.type || 'video/mp4',
    });

    await r2Client.send(command);

    if (onProgress) onProgress(100);

    const publicUrl = `${R2_PUBLIC_BASE_URL}/${fileName}`;
    return { url: publicUrl, error: null };
  } catch (err: any) {
    console.error('Cloudflare R2 upload error:', err);
    return { url: null, error: err?.message || 'Failed to upload to Cloudflare R2' };
  }
}

/**
 * Deletes a video file from the Cloudflare R2 bucket given its public URL or key.
 */
export async function deleteVideoFromR2(
  videoUrlOrKey: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!videoUrlOrKey) return { success: true, error: null };

    // Extract key: e.g. "https://pub-56963dfb15bd4eb2a9cc52b9c62aedcf.r2.dev/prompts/xyz.mp4" -> "prompts/xyz.mp4"
    let key = videoUrlOrKey;
    if (key.includes(R2_PUBLIC_BASE_URL)) {
      key = key.replace(`${R2_PUBLIC_BASE_URL}/`, '');
    } else if (key.startsWith('http')) {
      const urlObj = new URL(key);
      key = urlObj.pathname.replace(/^\/+/, '');
    }

    if (!key) return { success: true, error: null };

    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`✓ Deleted from Cloudflare R2: ${key}`);
    return { success: true, error: null };
  } catch (err: any) {
    console.warn('Failed to delete video from Cloudflare R2:', err);
    return { success: false, error: err?.message || 'Delete from R2 failed' };
  }
}
