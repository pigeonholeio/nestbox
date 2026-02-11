export const CONSTANTS = {
  MAX_RECIPIENTS: 3,
  DEFAULT_EXPIRATION_DAYS: 28,
  LOGO_URL: 'https://pigeono.io/assets/images/logo-small-transparent.png',
  APP_NAME: 'PigeonHole',
  APP_TAGLINE: 'Secure, encrypted file sharing',
};

export const STORAGE_KEYS = {
  THEME: 'pigeonhole_theme',
  KEY_PREFIX: 'pigeonhole_key_',
};

export const ERROR_CODES = {
  AUTH0_ERROR: 'AUTH0_ERROR',
  CRYPTO_ERROR: 'CRYPTO_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DECRYPTION_ERROR: 'DECRYPTION_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_EMAIL: 'INVALID_EMAIL',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
};
