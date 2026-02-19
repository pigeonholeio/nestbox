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
  payloadSize: number,
  options: {
    ephemeralkeys: boolean;
    onetime: boolean;
    expiration?: string;
  }
): Promise<CreateSecretResponse> {
  const request: CreateSecretRequest = {
    recipient_ids: recipientIds,
    reference,
    total_payload_size: payloadSize,
    ephemeralkeys: options.ephemeralkeys,
    onetime: options.onetime,
    expiration: options.expiration,
  };

  try {
    const response = await apiClient.post<CreateSecretResponse>('/secret', request);
    return response.data;
  } catch (error: any) {
    // Handle quota exceeded errors with detailed messages
    if (error.response?.status === 429 || error.response?.status === 413) {
      const quotaErr = error.response.data;
      if (quotaErr?.quota_type) {
        let errorMessage = quotaErr.message || 'Quota exceeded';
        if (quotaErr.quota_type === 'secrets_count') {
          errorMessage = `Secret quota exceeded: ${quotaErr.current_usage}/${quotaErr.limit} secrets. Delete a secret to send more.`;
        } else if (quotaErr.quota_type === 'total_bytes') {
          const currentMB = (quotaErr.current_usage / (1024 * 1024)).toFixed(1);
          const limitMB = (quotaErr.limit / (1024 * 1024)).toFixed(1);
          errorMessage = `Total data quota exceeded: ${currentMB}MB / ${limitMB}MB used. Try a smaller file.`;
        } else if (quotaErr.quota_type === 'file_size') {
          const fileMB = (quotaErr.requested / (1024 * 1024)).toFixed(1);
          const limitMB = (quotaErr.limit / (1024 * 1024)).toFixed(1);
          errorMessage = `File too large: ${fileMB}MB exceeds maximum of ${limitMB}MB.`;
        }
        throw new Error(errorMessage);
      }
    }
    throw error;
  }
}

/**
 * Upload encrypted data to S3
 */
export async function uploadToS3(
  url: string,
  fields: Record<string, string | string[]>,
  encryptedData: Uint8Array,
  onProgress?: (percent: number) => void
): Promise<void> {
  // Extract metadata from fields to send as headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/octet-stream',
  };

  // Add metadata headers if they exist in the fields
  const metadataKeys = [
    'x-amz-meta-sender_id',
    'x-amz-meta-recipient_ids',
    'x-amz-meta-reference',
    'x-amz-meta-expiration',
    'x-amz-meta-onetime',
  ];

  metadataKeys.forEach((key) => {
    if (fields[key]) {
      const value = fields[key];
      headers[key] = Array.isArray(value) ? value.join(',') : String(value);
    }
  });

  // For presigned PUT requests, send the file with the metadata headers
  // The presigned URL in the query string provides authentication
  await axios.put(url, encryptedData, {
    headers,
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
  try {
    // First request to get the download URL
    const response = await apiClient.get(`/secret/${secretId}/download`, {
      validateStatus: (status) => status === 200,
      timeout: 30000,
    });

    // Handle 200 response with download URL
    if (response.status === 200) {
      // Check for DownloadUrl in camelCase (from SDK) or downloadUrl
      const downloadUrl = response.data?.DownloadUrl || response.data?.downloadUrl;

      if (!downloadUrl) {
        throw new Error('No download URL provided in response');
      }

      // Download the actual file from the S3 URL
      // Use plain axios without auth interceptor since S3 presigned URLs include auth in the URL
      const plainAxios = axios.create();

      const fileResponse = await plainAxios.get(downloadUrl, {
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

      // Ensure data is converted to Uint8Array
      const data = fileResponse.data;
      if (data instanceof ArrayBuffer) {
        return new Uint8Array(data);
      } else if (data instanceof Uint8Array) {
        return data;
      } else if (typeof data === 'string') {
        // If data is a string, encode it
        const encoder = new TextEncoder();
        return encoder.encode(data);
      } else {
        return new Uint8Array(data);
      }
    }

    throw new Error('Invalid response from server');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to download secret: ${error.message}`);
    }
    throw error;
  }
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
