/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

/**
 * Format expiration countdown
 */
export function formatExpiration(expirationString?: string): string {
  if (!expirationString) return 'Never';

  const expiration = new Date(expirationString);
  const now = new Date();
  const diffMs = expiration.getTime() - now.getTime();

  if (diffMs < 0) return 'Expired';

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}

/**
 * Check if expiring soon (less than 24 hours)
 */
export function isExpiringSoon(expirationString?: string): boolean {
  if (!expirationString) return false;

  const expiration = new Date(expirationString);
  const now = new Date();
  const diffMs = expiration.getTime() - now.getTime();
  const diffHours = diffMs / 3600000;

  return diffHours > 0 && diffHours < 24;
}

/**
 * Format key fingerprint for display (shortened)
 */
export function formatFingerprint(fingerprint: string): string {
  if (fingerprint.length <= 16) return fingerprint;

  // Format as AB12:CD34:...
  const parts: string[] = [];
  for (let i = 0; i < Math.min(fingerprint.length, 12); i += 4) {
    parts.push(fingerprint.substring(i, i + 4));
  }
  return parts.join(':') + '...';
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'ppt':
    case 'pptx':
      return '📽️';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return '🖼️';
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
      return '🗜️';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return '🎵';
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬';
    case 'txt':
      return '📃';
    case 'json':
    case 'xml':
    case 'csv':
      return '📋';
    default:
      return '📦';
  }
}
