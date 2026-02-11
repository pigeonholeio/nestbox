import { apiClient } from './client';
import type {
  UserMeResponse,
  UserSearchParams,
  UserSearchResponse,
  UploadKeyRequest,
  UploadKeyResponse,
  ValidateKeyResponse,
  CreateEphemeralUserRequest,
  CreateEphemeralUserResponse,
} from '@/types/api.types';

/**
 * Get current user details
 */
export async function getCurrentUser(): Promise<UserMeResponse> {
  const response = await apiClient.get<UserMeResponse>('/user/me');
  return response.data;
}

/**
 * Get current user's keys
 */
export async function getCurrentUserKeys(): Promise<ValidateKeyResponse> {
  const response = await apiClient.get<ValidateKeyResponse>('/user/me/key');
  return response.data;
}

/**
 * Upload a new public key
 */
export async function uploadPublicKey(
  keyData: string,
  thumbprint: string,
  userEmail: string
): Promise<UploadKeyResponse> {
  const request: UploadKeyRequest = {
    key_data: keyData,
    thumbprint: thumbprint,
    reference: `${userEmail}_primary_key`,
    only: true,
    force: false,
  };

  const response = await apiClient.post<UploadKeyResponse>('/user/me/key', request);
  return response.data;
}

/**
 * Validate key by thumbprint for current user
 */
export async function validateKey(thumbprint: string): Promise<ValidateKeyResponse> {
  const response = await apiClient.get<ValidateKeyResponse>(
    `/user/me/key/validate/${thumbprint}`
  );
  return response.data;
}

/**
 * Validate key by thumbprint for a specific user
 */
export async function validateKeyForUser(
  userId: string,
  thumbprint: string
): Promise<ValidateKeyResponse> {
  const response = await apiClient.get<ValidateKeyResponse>(
    `/user/${userId}/key/validate/${thumbprint}`
  );
  return response.data;
}

/**
 * Get user details by user ID
 */
export async function getUserById(userId: string): Promise<UserMeResponse> {
  const response = await apiClient.get<UserMeResponse>(`/user/${userId}`);
  return response.data;
}

/**
 * Get public keys for a specific user by user ID
 */
export async function getUserKeysByUserId(userId: string): Promise<ValidateKeyResponse> {
  const response = await apiClient.get<ValidateKeyResponse>(`/user/${userId}/key`);
  return response.data;
}

/**
 * Upload a public key for a specific user by user ID
 */
export async function uploadPublicKeyForUser(
  userId: string,
  keyData: string,
  thumbprint: string,
  reference: string
): Promise<UploadKeyResponse> {
  const request: UploadKeyRequest = {
    key_data: keyData,
    thumbprint: thumbprint,
    reference: reference,
  };

  const response = await apiClient.post<UploadKeyResponse>(
    `/user/${userId}/key`,
    request
  );
  return response.data;
}

/**
 * Delete a public key for a specific user by user ID
 */
export async function deletePublicKeyForUser(
  userId: string,
  keyId: string
): Promise<UploadKeyResponse> {
  const response = await apiClient.delete<UploadKeyResponse>(
    `/user/${userId}/key/${keyId}`
  );
  return response.data;
}

/**
 * Get a specific key for a user by user ID and key ID
 */
export async function getUserKeyById(userId: string, keyId: string): Promise<UploadKeyResponse> {
  const response = await apiClient.get<UploadKeyResponse>(`/user/${userId}/key/${keyId}`);
  return response.data;
}

/**
 * Get public information about a user
 */
export async function getUserPublic(userId: string): Promise<UserMeResponse> {
  const response = await apiClient.get<UserMeResponse>(`/user/${userId}/public`);
  return response.data;
}

/**
 * Search users by email
 */
export async function searchUsers(
  emails: string[],
  includeEphemeralKeys: boolean = false
): Promise<UserSearchResponse> {
  const params = new URLSearchParams();
  emails.forEach(email => params.append('email', email));
  params.append('ephemeralkeys', includeEphemeralKeys.toString());

  const response = await apiClient.get<UserSearchResponse>(`/user?${params.toString()}`);
  return response.data;
}

/**
 * Create or retrieve ephemeral user with generated keys
 */
export async function createEphemeralUser(
  email: string
): Promise<CreateEphemeralUserResponse> {
  const request: CreateEphemeralUserRequest = { email };
  const response = await apiClient.post<CreateEphemeralUserResponse>(
    '/user/ephemeral-user',
    request
  );
  return response.data;
}
