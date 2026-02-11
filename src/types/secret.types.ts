// Secret management types

export interface SecretOptions {
  expiration?: string;  // ISO date string
  onetime: boolean;
  reference: string;
}

export interface Recipient {
  email: string;
  user_id?: string;
  isTransient: boolean;
  keyFingerprint?: string;
}

export interface SendSecretResult {
  secretId: string;
  secretReference: string;
  recipients: Recipient[];
}

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

export interface DecryptedFile {
  name: string;
  data: Uint8Array;
  size: number;
  type: string;
  lastModified: number;
}

export type ExpirationPreset = '1hour' | '24hours' | '7days' | '28days' | 'never';

export const EXPIRATION_PRESETS: Record<ExpirationPreset, { label: string; hours: number | null }> = {
  '1hour': { label: '1 Hour', hours: 1 },
  '24hours': { label: '24 Hours', hours: 24 },
  '7days': { label: '7 Days', hours: 168 },
  '28days': { label: '28 Days', hours: 672 },
  'never': { label: 'Never', hours: null },
};
