import * as openpgp from 'openpgp';
import type { User } from '@/types/api.types';
import type { EncryptionProgress } from '@/types/crypto.types';

/**
 * Encrypt data with multiple recipients' public keys
 */
export async function encryptForRecipients(
  data: Uint8Array,
  recipients: User[],
  onProgress?: (progress: EncryptionProgress) => void
): Promise<Uint8Array> {
  onProgress?.({ stage: 'Preparing encryption...', percent: 0 });

  // Read all recipient public keys
  const recipientPublicKeys = await Promise.all(
    recipients.map(async (user) => {
      if (!user.keys || user.keys.length === 0) {
        throw new Error(`User ${user.email} has no public keys`);
      }
      const keyData = user.keys[0].key_data;
      return await openpgp.readKey({ armoredKey: keyData });
    })
  );

  onProgress?.({ stage: 'Encrypting...', percent: 30 });

  // Create message from binary data
  const message = await openpgp.createMessage({ binary: data });

  onProgress?.({ stage: 'Encrypting...', percent: 50 });

  // Encrypt with all recipient keys
  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: recipientPublicKeys,
    format: 'binary',
  }) as Uint8Array;

  onProgress?.({ stage: 'Encryption complete', percent: 100 });

  return encrypted;
}

/**
 * Encrypt a single file for recipients
 */
export async function encryptFile(
  file: File,
  recipients: User[],
  onProgress?: (progress: EncryptionProgress) => void
): Promise<Uint8Array> {
  onProgress?.({ stage: 'Reading file...', percent: 0 });

  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  onProgress?.({ stage: 'Encrypting file...', percent: 20 });

  return encryptForRecipients(data, recipients, (progress) => {
    // Scale progress from 20-100%
    const scaledPercent = 20 + (progress.percent * 0.8);
    onProgress?.({ ...progress, percent: scaledPercent });
  });
}
