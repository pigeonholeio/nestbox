import { apiClient } from './client';
import type {
  TokenExchangeRequest,
  TokenExchangeResponse,
  OIDCProvidersResponse,
  ServerInfoResponse,
} from '@/types/api.types';

/**
 * Get available OIDC providers
 */
export async function getOIDCProviders(): Promise<OIDCProvidersResponse> {
  const response = await apiClient.get<OIDCProvidersResponse>('/auth/oidc/providers');
  return response.data;
}

/**
 * Get server info and test authentication
 */
export async function ping(): Promise<ServerInfoResponse> {
  const response = await apiClient.get<ServerInfoResponse>('/ping');
  return response.data;
}

/**
 * Exchange OIDC token for PigeonHole JWT
 */
export async function exchangeOIDCToken(
  provider: string,
  accessToken: string
): Promise<TokenExchangeResponse> {
  const request: TokenExchangeRequest = { accessToken };
  const response = await apiClient.post<TokenExchangeResponse>(
    `/auth/oidc/handler/${provider}`,
    request
  );
  return response.data;
}

/**
 * Exchange Auth0 token for PigeonHole JWT (legacy function, uses generic handler)
 */
export async function exchangeAuth0Token(
  accessToken: string
): Promise<TokenExchangeResponse> {
  return exchangeOIDCToken('auth0', accessToken);
}
