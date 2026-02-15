import { apiClient } from './client';
import type {
  UserMeResponse,
  UserSearchResponse,
  UploadKeyRequest,
  UploadKeyResponse,
  ValidateKeyResponse,
  CreateEphemeralUserRequest,
  CreateEphemeralUserResponse,
} from '@/types/api.types';

/**
 * Generate a random pet name like Terraform's random_pet
 */
function generateRandomPet(): string {
  const adjectives = [
    'fluffy', 'quick', 'sleepy', 'lazy', 'happy', 'sad', 'brave', 'shy',
    'smart', 'silly', 'calm', 'wild', 'tiny', 'giant', 'swift', 'slow',
    'jolly', 'gloomy', 'bright', 'dark', 'warm', 'cool', 'soft', 'hard',
    'sweet', 'bitter', 'salty', 'spicy', 'smooth', 'rough', 'clean', 'dirty'
  ];

  const animals = [
    'pigeon', 'dove', 'eagle', 'hawk', 'owl', 'raven', 'crow', 'sparrow',
    'finch', 'swallow', 'thrush', 'robin', 'lark', 'wren', 'jay', 'magpie',
    'stork', 'crane', 'heron', 'egret', 'albatross', 'pelican', 'puffin', 'tern',
    'gull', 'kestrel', 'falcon', 'buzzard', 'condor', 'vulture', 'kingfisher', 'woodpecker'
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNumber = Math.floor(Math.random() * 10000);

  return `${randomAdjective}-${randomAnimal}-${randomNumber}`;
}

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
  thumbprint: string
): Promise<UploadKeyResponse> {
  // Base64 encode the armored public key
  const base64KeyData = btoa(keyData);

  const request: UploadKeyRequest = {
    key_data: base64KeyData,
    thumbprint: thumbprint,
    reference: generateRandomPet(),
    only: true,
    force: false,
    transient: false,
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
  // Base64 encode the armored public key
  const base64KeyData = btoa(keyData);

  const request: UploadKeyRequest = {
    key_data: base64KeyData,
    thumbprint: thumbprint,
    reference: reference,
    transient: false,
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
  // If only one email and ephemeral keys are requested, try the ephemeral user endpoint first
  if (includeEphemeralKeys && emails.length === 1) {
    try {
      const ephemeralResponse = await createEphemeralUser(emails[0]);
      return {
        message: 'Ephemeral user created',
        users: [ephemeralResponse.user],
      };
    } catch (error) {
      // Fall back to regular search if ephemeral creation fails
      console.error('Failed to create ephemeral user, falling back to search:', error);
    }
  }

  // Regular user search
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
