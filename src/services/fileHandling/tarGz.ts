import pako from 'pako';
import type { DecryptedFile } from '@/types/secret.types';

/**
 * Create tar.gz archive from multiple files
 * Note: Using a simplified tar implementation since tar-js has limitations
 */
export async function createTarGz(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  onProgress?.(0);

  // Create a simple tar-like structure
  const tarData: Uint8Array[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Create a simple header
    const header = createTarHeader(file.name, fileData.length, file.lastModified);
    tarData.push(header);
    tarData.push(fileData);

    // Add padding to 512-byte boundary
    const padding = 512 - (fileData.length % 512);
    if (padding !== 512) {
      tarData.push(new Uint8Array(padding));
    }

    if (onProgress) {
      onProgress((i + 1) / files.length);
    }
  }

  // Combine all tar data
  const totalLength = tarData.reduce((sum, arr) => sum + arr.length, 0);
  const combinedTar = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of tarData) {
    combinedTar.set(chunk, offset);
    offset += chunk.length;
  }

  // Gzip compress
  const gzippedData = pako.gzip(combinedTar);

  return new Blob([gzippedData], { type: 'application/gzip' });
}

/**
 * Extract tar.gz archive to files
 */
export async function extractTarGz(gzippedData: Uint8Array): Promise<DecryptedFile[]> {
  // Decompress gzip
  const tarData = pako.ungzip(gzippedData);

  // Parse tar data
  const files: DecryptedFile[] = [];
  let offset = 0;

  while (offset < tarData.length) {
    // Check if we've reached the end (tar files end with at least two null blocks)
    if (tarData[offset] === 0) {
      break;
    }

    // Read tar header
    const header = parseTarHeader(tarData.slice(offset, offset + 512));
    offset += 512;

    if (!header.name) {
      break;
    }

    // Read file data
    const fileData = tarData.slice(offset, offset + header.size);
    offset += header.size;

    // Skip padding to 512-byte boundary
    const padding = 512 - (header.size % 512);
    if (padding !== 512) {
      offset += padding;
    }

    files.push({
      name: header.name,
      data: fileData,
      size: header.size,
      type: 'application/octet-stream',
      lastModified: header.mtime,
    });
  }

  return files;
}

/**
 * Create a tar header (simplified USTAR format)
 */
function createTarHeader(name: string, size: number, mtime: number): Uint8Array {
  const header = new Uint8Array(512);
  const encoder = new TextEncoder();

  // File name (offset 0, length 100)
  const nameBytes = encoder.encode(name.substring(0, 99));
  header.set(nameBytes, 0);

  // File mode (offset 100, length 8) - default 0644
  header.set(encoder.encode('0000644\0'), 100);

  // Owner ID (offset 108, length 8)
  header.set(encoder.encode('0000000\0'), 108);

  // Group ID (offset 116, length 8)
  header.set(encoder.encode('0000000\0'), 116);

  // File size (offset 124, length 12)
  const sizeStr = size.toString(8).padStart(11, '0') + '\0';
  header.set(encoder.encode(sizeStr), 124);

  // Modification time (offset 136, length 12)
  const mtimeStr = Math.floor(mtime / 1000).toString(8).padStart(11, '0') + '\0';
  header.set(encoder.encode(mtimeStr), 136);

  // Checksum placeholder (offset 148, length 8)
  header.set(encoder.encode('        '), 148);

  // Type flag (offset 156, length 1) - '0' for regular file
  header.set(encoder.encode('0'), 156);

  // USTAR indicator (offset 257, length 6)
  header.set(encoder.encode('ustar\0'), 257);

  // USTAR version (offset 263, length 2)
  header.set(encoder.encode('00'), 263);

  // Calculate and set checksum
  let checksum = 0;
  for (let i = 0; i < 512; i++) {
    checksum += header[i];
  }
  const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
  header.set(encoder.encode(checksumStr), 148);

  return header;
}

/**
 * Parse a tar header
 */
function parseTarHeader(header: Uint8Array): { name: string; size: number; mtime: number } {
  const decoder = new TextDecoder();

  // Read name (offset 0, length 100)
  const nameBytes = header.slice(0, 100);
  const nameEnd = nameBytes.indexOf(0);
  const name = decoder.decode(nameBytes.slice(0, nameEnd !== -1 ? nameEnd : 100));

  // Read size (offset 124, length 12)
  const sizeBytes = header.slice(124, 136);
  const sizeEnd = sizeBytes.indexOf(0);
  const sizeStr = decoder.decode(sizeBytes.slice(0, sizeEnd !== -1 ? sizeEnd : 12));
  const size = parseInt(sizeStr.trim(), 8) || 0;

  // Read mtime (offset 136, length 12)
  const mtimeBytes = header.slice(136, 148);
  const mtimeEnd = mtimeBytes.indexOf(0);
  const mtimeStr = decoder.decode(mtimeBytes.slice(0, mtimeEnd !== -1 ? mtimeEnd : 12));
  const mtime = (parseInt(mtimeStr.trim(), 8) || 0) * 1000;

  return { name, size, mtime };
}

/**
 * Download a file to the user's device
 */
export function downloadFile(file: DecryptedFile): void {
  const arrayBuffer = file.data.buffer as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: file.type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download all files as a ZIP
 */
export async function downloadAllAsZip(files: DecryptedFile[]): Promise<void> {
  // For simplicity, we'll download each file individually
  // In a production app, you might want to use a library like JSZip
  for (const file of files) {
    downloadFile(file);
    // Add a small delay between downloads to avoid browser blocking
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
