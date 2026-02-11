import * as openpgp from 'openpgp';
import type { DecryptionProgress, StoredKeyData } from '@/types/crypto.types';
import { decryptPrivateKey } from './keyGeneration';

/**
 * Decrypt data using user's private key
 */
export async function decryptData(
  encryptedData: Uint8Array,
  privateKeyArmored: string,
  onProgress?: (progress: DecryptionProgress) => void
): Promise<Uint8Array> {
  onProgress?.({ stage: 'Preparing decryption...', percent: 0 });

  // Read the private key
  const privateKey = await openpgp.readPrivateKey({
    armoredKey: privateKeyArmored,
  });

  onProgress?.({ stage: 'Reading encrypted data...', percent: 20 });

  // Read the encrypted message
  const message = await openpgp.readMessage({
    binaryMessage: encryptedData,
  });

  onProgress?.({ stage: 'Decrypting...', percent: 40 });

  // Decrypt the message
  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
    format: 'binary',
  });

  onProgress?.({ stage: 'Decryption complete', percent: 100 });

  return decrypted as Uint8Array;
}

/**
 * Decrypt data using stored encrypted private key
 */
export async function decryptDataWithStoredKey(
  encryptedData: Uint8Array,
  encryptedPrivateKey: string,
  iv: string,
  keyMaterial: string,
  onProgress?: (progress: DecryptionProgress) => void
): Promise<Uint8Array> {
  onProgress?.({ stage: 'Unlocking private key...', percent: 0 });

  // Decrypt the private key first
  const privateKeyArmored = await decryptPrivateKey(
    encryptedPrivateKey,
    iv,
    keyMaterial
  );

  onProgress?.({ stage: 'Private key unlocked', percent: 20 });

  // Now decrypt the data
  return decryptData(encryptedData, privateKeyArmored, (progress) => {
    // Scale progress from 20-100%
    const scaledPercent = 20 + (progress.percent * 0.8);
    onProgress?.({ ...progress, percent: scaledPercent });
  });
}

/**
 * Decrypt secret using StoredKeyData
 */
export async function decryptSecret(
  encryptedData: Uint8Array,
  keyData: StoredKeyData,
  onProgress?: (progress: DecryptionProgress) => void
): Promise<Uint8Array> {
  return decryptDataWithStoredKey(
    encryptedData,
    keyData.encryptedPrivateKey,
    keyData.iv,
    keyData.keyMaterial,
    onProgress
  );
}
