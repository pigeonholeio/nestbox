import axios from 'axios';
import { apiClient } from './client';
import type {
  CreateSecretRequest,
  CreateSecretResponse,
  SecretListResponse,
  SecretDetailResponse,
  Secret,
} from '@/types/api.types';

/**
 * Create a new secret envelope and get S3 presigned URL
 */
export async function createSecret(
  recipientIds: string[],
  reference: string,
  options: {
    ephemeralkeys: boolean;
    onetime: boolean;
    expiration?: string;
  }
): Promise<CreateSecretResponse> {
  const request: CreateSecretRequest = {
    recipient_ids: recipientIds,
    reference,
    ephemeralkeys: options.ephemeralkeys,
    onetime: options.onetime,
    expiration: options.expiration,
  };

  const response = await apiClient.post<CreateSecretResponse>('/secret', request);
  return response.data;
}

/**
 * Upload encrypted data to S3
 */
export async function uploadToS3(
  url: string,
  fields: Record<string, string>,
  encryptedData: Uint8Array,
  onProgress?: (percent: number) => void
): Promise<void> {
  const formData = new FormData();

  // Add all S3 fields
  Object.keys(fields).forEach((key) => {
    formData.append(key, fields[key]);
  });

  // Add the encrypted file
  const arrayBuffer = encryptedData.buffer as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
  formData.append('file', blob, 'secret.pgp');

  // Upload to S3
  await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
}

/**
 * Get list of received secrets
 */
export async function getReceivedSecrets(): Promise<Secret[]> {
  const response = await apiClient.get<SecretListResponse>('/secret');
  return response.data.secrets;
}

/**
 * Get secrets by reference
 */
export async function getSecretsByReference(reference: string): Promise<Secret[]> {
  const response = await apiClient.get<SecretListResponse>('/secret', {
    params: { reference },
  });
  return response.data.secrets;
}

/**
 * Get secret details with download URL
 */
export async function getSecretDetails(secretId: string): Promise<SecretDetailResponse> {
  const response = await apiClient.get<any>(`/secret/${secretId}`);
  // Map API response to our interface - the API uses snake_case
  return {
    ...response.data,
    downloadUrl: response.data.downloadUrl || response.data.download_url,
    secretReference: response.data.secretReference || response.data.secret_reference,
  } as SecretDetailResponse;
}

/**
 * Download encrypted secret data
 */
export async function downloadSecret(
  secretId: string,
  onProgress?: (percent: number) => void
): Promise<Uint8Array> {
  const response = await apiClient.get(`/secret/${secretId}/download`, {
    responseType: 'arraybuffer',
    onDownloadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });

  return new Uint8Array(response.data);
}

/**
 * Delete a specific secret
 */
export async function deleteSecret(secretId: string): Promise<void> {
  await apiClient.delete(`/secret/${secretId}`);
}

/**
 * Delete all received secrets
 */
export async function deleteAllSecrets(): Promise<void> {
  await apiClient.delete('/secret');
}
