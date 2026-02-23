import { apiClient } from './client';

export interface SendInvitesResponse {
  message: string;
  sent_count: number;
  failed_emails: string[];
}

export interface UserCheckResponse {
  email: string;
  exists: boolean;
}

/**
 * Send invitations to recipients
 */
export async function sendInvites(recipients: string[]): Promise<SendInvitesResponse> {
  const response = await apiClient.post<SendInvitesResponse>('/user/invite', {
    recipients,
  });
  return response.data;
}

/**
 * Check if a user exists by email
 */
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const response = await apiClient.get<UserCheckResponse>('/user', {
      params: { email },
    });
    return response.data.exists;
  } catch (err) {
    console.error('Error checking user existence:', err);
    throw err;
  }
}
