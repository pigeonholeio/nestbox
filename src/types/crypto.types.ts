// Cryptography types

export interface StoredKeyData {
  encryptedPrivateKey: string;  // Base64-encoded wrapped key
  publicKey: string;            // PGP armored public key
  thumbprint: string;           // Key fingerprint (SHA256)
  iv: string;                   // IV for AES-GCM (Base64)
  salt: string;                 // Salt for key derivation (Base64)
  keyMaterial: string;          // Base64-encoded key material for decryption
  createdAt: string;            // ISO timestamp
  email: string;                // User email
}

export interface KeyPair {
  privateKey: string;  // PGP armored
  publicKey: string;   // PGP armored
}

export interface EncryptionProgress {
  stage: string;
  percent: number;
}

export interface DecryptionProgress {
  stage: string;
  percent: number;
}

export interface EncryptedData {
  data: Uint8Array;
  format: 'binary' | 'armored';
}
