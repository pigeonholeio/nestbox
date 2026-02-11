import type { StoredKeyData } from '@/types/crypto.types';

const KEY_PREFIX = 'pigeonhole_key_';

/**
 * Store encrypted key in localStorage for a specific user
 */
export function storeKey(email: string, keyData: StoredKeyData): void {
  const storageKey = `${KEY_PREFIX}${email}`;
  localStorage.setItem(storageKey, JSON.stringify(keyData));
}

/**
 * Load stored key for a specific user
 */
export function loadStoredKey(email: string): StoredKeyData | null {
  const storageKey = `${KEY_PREFIX}${email}`;
  const storedData = localStorage.getItem(storageKey);

  if (!storedData) {
    return null;
  }

  try {
    return JSON.parse(storedData) as StoredKeyData;
  } catch (error) {
    console.error('Failed to parse stored key data:', error);
    return null;
  }
}

/**
 * Check if a user has a stored key
 */
export function hasStoredKey(email: string): boolean {
  const storageKey = `${KEY_PREFIX}${email}`;
  return localStorage.getItem(storageKey) !== null;
}

/**
 * Delete stored key for a specific user
 */
export function deleteStoredKey(email: string): void {
  const storageKey = `${KEY_PREFIX}${email}`;
  localStorage.removeItem(storageKey);
}

/**
 * Get all stored key emails (for multi-account support)
 */
export function getAllStoredKeyEmails(): string[] {
  const emails: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX)) {
      const email = key.substring(KEY_PREFIX.length);
      emails.push(email);
    }
  }

  return emails;
}

/**
 * Clear all stored keys (use with caution)
 */
export function clearAllKeys(): void {
  const emails = getAllStoredKeyEmails();
  emails.forEach(email => deleteStoredKey(email));
}
