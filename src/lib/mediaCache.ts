/**
 * High-performance browser IndexedDB persistent media cache.
 * Allows storing large base64/Blob videos locally across sessions
 * with unlimited storage (unlike localStorage's 5MB cap).
 */

const DB_NAME = 'prompt_studio_media_db_v1';
const DB_VERSION = 1;
const STORE_NAME = 'preview_videos';

function openMediaDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open error, falling back to network');
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

export async function getCachedVideo(id: string): Promise<string | null> {
  try {
    const db = await openMediaDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function setCachedVideo(id: string, data: string): Promise<void> {
  try {
    const db = await openMediaDB();
    if (!db) return;

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data, id);
  } catch (err) {
    console.warn('Failed to cache video in IndexedDB:', err);
  }
}

export async function getAllCachedVideos(): Promise<Record<string, string>> {
  try {
    const db = await openMediaDB();
    if (!db) return {};

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      const results: Record<string, string> = {};

      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}
