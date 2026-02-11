import { useState } from 'react';
import { encryptForRecipients } from '@/services/crypto/encryption';
import { decryptSecret } from '@/services/crypto/decryption';
import { createTarGz, extractTarGz } from '@/services/fileHandling/tarGz';
import type { User } from '@/types/api.types';
import type { EncryptionProgress, DecryptionProgress } from '@/types/crypto.types';
import type { DecryptedFile } from '@/types/secret.types';
import { useKeyStore } from '@/stores/keyStore';

/**
 * Hook for encryption and decryption operations
 */
export function useCrypto() {
  const [encryptionProgress, setEncryptionProgress] = useState<EncryptionProgress>({
    stage: 'Ready',
    percent: 0,
  });
  const [decryptionProgress, setDecryptionProgress] = useState<DecryptionProgress>({
    stage: 'Ready',
    percent: 0,
  });
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentKey } = useKeyStore();

  /**
   * Encrypt files for recipients
   */
  const encryptFiles = async (
    files: File[],
    recipients: User[]
  ): Promise<Uint8Array> => {
    setIsEncrypting(true);
    setError(null);

    try {
      // Stage 1: Compress files (0-40%)
      setEncryptionProgress({ stage: 'Compressing files...', percent: 0 });
      const tarGzBlob = await createTarGz(files, (percent) => {
        setEncryptionProgress({
          stage: 'Compressing files...',
          percent: Math.round(percent * 40),
        });
      });

      // Stage 2: Encrypt (40-100%)
      setEncryptionProgress({ stage: 'Encrypting...', percent: 40 });
      const tarGzData = new Uint8Array(await tarGzBlob.arrayBuffer());

      const encrypted = await encryptForRecipients(tarGzData, recipients, (progress) => {
        setEncryptionProgress({
          stage: progress.stage,
          percent: 40 + Math.round(progress.percent * 0.6),
        });
      });

      setEncryptionProgress({ stage: 'Complete', percent: 100 });
      return encrypted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsEncrypting(false);
    }
  };

  /**
   * Decrypt encrypted data
   */
  const decryptData = async (
    encryptedData: Uint8Array,
    _userEmail: string
  ): Promise<DecryptedFile[]> => {
    if (!currentKey) {
      throw new Error('No encryption key available');
    }

    setIsDecrypting(true);
    setError(null);

    try {
      // Stage 1: Decrypt (0-70%)
      setDecryptionProgress({ stage: 'Decrypting...', percent: 0 });

      const decryptedData = await decryptSecret(
        encryptedData,
        currentKey,
        (progress) => {
          setDecryptionProgress({
            stage: progress.stage,
            percent: Math.round(progress.percent * 0.7),
          });
        }
      );

      // Stage 2: Extract files (70-100%)
      setDecryptionProgress({ stage: 'Extracting files...', percent: 70 });
      const files = await extractTarGz(decryptedData);

      setDecryptionProgress({ stage: 'Complete', percent: 100 });
      return files;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  };

  const resetProgress = () => {
    setEncryptionProgress({ stage: 'Ready', percent: 0 });
    setDecryptionProgress({ stage: 'Ready', percent: 0 });
    setError(null);
  };

  return {
    encryptFiles,
    decryptData,
    encryptionProgress,
    decryptionProgress,
    isEncrypting,
    isDecrypting,
    error,
    resetProgress,
  };
}
