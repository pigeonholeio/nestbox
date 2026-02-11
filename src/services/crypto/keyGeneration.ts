import * as openpgp from 'openpgp';
import type { KeyPair, StoredKeyData } from '@/types/crypto.types';

/**
 * Generate RSA 4096-bit keypair using OpenPGP
 */
export async function generateKeypair(
  userName: string,
  userEmail: string
): Promise<KeyPair> {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 4096,
    userIDs: [{ name: userName, email: userEmail }],
    format: 'armored',
  });

  return { privateKey, publicKey };
}

/**
 * Encrypt private key using Web Crypto API with AES-GCM
 */
export async function encryptPrivateKey(
  privateKeyArmored: string
): Promise<{
  encryptedPrivateKey: string;
  iv: string;
  salt: string;
  keyMaterial: string;
}> {
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Generate key material (this will be stored to allow decryption)
  const keyMaterial = crypto.getRandomValues(new Uint8Array(32));

  // Import key material as CryptoKey
  const wrappingKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  // Convert armored key to bytes
  const encoder = new TextEncoder();
  const privateKeyBytes = encoder.encode(privateKeyArmored);

  // Encrypt the private key
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    wrappingKey,
    privateKeyBytes.buffer
  );

  return {
    encryptedPrivateKey: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
    keyMaterial: arrayBufferToBase64(keyMaterial.buffer as ArrayBuffer),
  };
}

/**
 * Decrypt stored private key
 */
export async function decryptPrivateKey(
  encryptedKeyBase64: string,
  ivBase64: string,
  keyMaterialBase64: string
): Promise<string> {
  const encryptedData = base64ToArrayBuffer(encryptedKeyBase64);
  const iv = base64ToArrayBuffer(ivBase64);
  const keyMaterial = base64ToArrayBuffer(keyMaterialBase64);

  // Re-import the wrapping key
  const wrappingKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // Decrypt the private key
  const decryptedBytes = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    wrappingKey,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBytes);
}

/**
 * Calculate key thumbprint (fingerprint)
 */
export async function calculateThumbprint(publicKeyArmored: string): Promise<string> {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const fingerprint = publicKey.getFingerprint();
  return fingerprint;
}

/**
 * Complete key initialization for first-time users
 */
export async function initializeUserKeys(
  userName: string,
  userEmail: string,
  onProgress?: (percent: number) => void
): Promise<StoredKeyData> {
  // 1. Generate keypair (0-40%)
  onProgress?.(0);
  const { privateKey, publicKey } = await generateKeypair(userName, userEmail);
  onProgress?.(40);

  // 2. Encrypt private key (40-70%)
  const { encryptedPrivateKey, iv, salt, keyMaterial } = await encryptPrivateKey(privateKey);
  onProgress?.(70);

  // 3. Calculate thumbprint (70-90%)
  const thumbprint = await calculateThumbprint(publicKey);
  onProgress?.(90);

  // 4. Create key data object (90-100%)
  const keyData: StoredKeyData = {
    encryptedPrivateKey,
    publicKey,
    thumbprint,
    iv,
    salt,
    keyMaterial,
    createdAt: new Date().toISOString(),
    email: userEmail,
  };
  onProgress?.(100);

  return keyData;
}

// Utility functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
