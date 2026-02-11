import type { FriendlyError } from '@/types/user.types';

/**
 * Map technical errors to user-friendly messages
 */
export function mapErrorToFriendly(error: unknown): FriendlyError {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check for specific error codes/patterns
  if (errorMessage.includes('auth0') || errorMessage.includes('AUTH0')) {
    return {
      title: 'Sign In Failed',
      message: "We couldn't sign you in. Please try again or contact support.",
      severity: 'error',
      action: 'Try signing in again',
    };
  }

  if (errorMessage.includes('crypto') || errorMessage.includes('key generation')) {
    return {
      title: 'Encryption Key Error',
      message: 'Something went wrong creating your encryption key. Please refresh and try again.',
      severity: 'error',
      action: 'Refresh the page',
    };
  }

  if (errorMessage.includes('USER_NOT_FOUND') || errorMessage.includes('not found')) {
    const emailMatch = errorMessage.match(/USER_NOT_FOUND:(.+)/);
    const email = emailMatch ? emailMatch[1] : 'this user';
    return {
      title: 'User Not Found',
      message: `We couldn't find ${email} on PigeonHole. Enable 'Transient Key' to send anyway.`,
      severity: 'warning',
      action: "Enable transient key",
    };
  }

  if (errorMessage.includes('network') || errorMessage.includes('NETWORK_ERROR')) {
    return {
      title: 'Connection Error',
      message: 'Upload interrupted. Check your connection and try again.',
      severity: 'error',
      action: 'Check your connection',
    };
  }

  if (errorMessage.includes('decrypt') || errorMessage.includes('DECRYPTION_ERROR')) {
    return {
      title: 'Decryption Failed',
      message: "We couldn't decrypt this secret. It may be corrupted or sent to a different key.",
      severity: 'error',
    };
  }

  if (errorMessage.includes('too large') || errorMessage.includes('FILE_TOO_LARGE')) {
    return {
      title: 'File Too Large',
      message: 'This file exceeds the maximum size limit. Please try a smaller file.',
      severity: 'error',
    };
  }

  if (errorMessage.includes('invalid email') || errorMessage.includes('INVALID_EMAIL')) {
    return {
      title: 'Invalid Email',
      message: 'Please enter a valid email address.',
      severity: 'warning',
    };
  }

  if (errorMessage.includes('token') || errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired. Please sign in again.',
      severity: 'warning',
      action: 'Sign in again',
    };
  }

  // Default error
  return {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    severity: 'error',
  };
}
