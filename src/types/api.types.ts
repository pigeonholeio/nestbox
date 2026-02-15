// API Response types

export interface GeneralMessage {
  message: string;
  code?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Auth types
export interface TokenExchangeRequest {
  accessToken: string;
}

export interface Token {
  accessToken: string;
}

export interface TokenExchangeResponse extends GeneralMessage {
  accessToken: string;
}

export interface OIDCProvider {
  name: string;
  handlerUrl?: string;
  userInfoUrl?: string;
  authUrl: string;
  tokenUrl: string;
  deviceAuthURL: string;
  clientID: string;
  scopes: string[];
}

export interface OIDCProvidersResponse extends GeneralMessage {
  oidcProviders: Record<string, OIDCProvider>;
  default: string;
}

export interface ServerInfoResponse {
  version: string;
}

// User types
export interface UserKey {
  id: string;
  key_data: string;
  thumbprint: string;
  reference: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  shortcode: string;
  keys: UserKey[];
}

export interface UserSearchParams {
  email: string[];
  ephemeralkeys: boolean;
}

export interface UserSearchResponse extends GeneralMessage {
  users: User[];
}

export interface UserMeResponse extends GeneralMessage {
  user: User;
}

export interface UploadKeyRequest {
  key_data: string;
  thumbprint: string;
  reference: string;
  only?: boolean;
  force?: boolean;
  transient?: boolean;
}

export interface UploadKeyResponse extends GeneralMessage {
  keys: UserKey[];
}

export interface ValidateKeyResponse extends GeneralMessage {
  keys: UserKey[];
}

// Secret types
export interface S3PresignedInfo {
  url: string;
  fields: Record<string, string | string[]>;
}

export interface CreateSecretRequest {
  recipient_ids: string[];
  reference: string;
  ephemeralkeys: boolean;
  onetime: boolean;
  expiration?: string;
}

export interface SecretEnvelopeS3Info {
  url: string;
  fields: Record<string, string | string[]>;
}

export interface CreateSecretResponse extends GeneralMessage {
  s3_info: SecretEnvelopeS3Info;
  users: User[];
}

export interface Secret {
  id?: string;
  reference: string;
  recipient: string;
  sender: string;
  sender_email?: string;
  sent_at: string;
  created_at?: string;
  expiration?: string;
  size: number;
  onetime: boolean;
  downloaded?: boolean;
  recipient_key_thumbprint?: string;
  recipient_key_fingerprint?: string;
}

export interface SecretListResponse extends GeneralMessage {
  secrets: Secret[];
}

export interface SecretDetailResponse extends GeneralMessage {
  secret: Secret;
  downloadUrl: string;
  secretReference: string;
}

export interface CreateEphemeralUserRequest {
  email: string;
}

export interface CreateEphemeralUserResponse extends GeneralMessage {
  user: User;
  keys: UserKey[];
}
