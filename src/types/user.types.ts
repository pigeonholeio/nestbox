// User and authentication types

export interface Auth0User {
  email: string;
  name: string;
  sub: string;
  email_verified: boolean;
  picture?: string;
}

export interface PigeonHoleUser {
  id: string;
  email: string;
  shortcode: string;
  keys: Array<{
    id: string;
    thumbprint: string;
    reference: string;
    created_at: string;
  }>;
}

export interface FriendlyError {
  title: string;
  message: string;
  action?: string;
  severity: 'error' | 'warning' | 'info';
  details?: string;
}
