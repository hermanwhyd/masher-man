/**
 * Encode a string
 */
export function encode(str: string): string {
  return btoa(str);
}

/**
 * Decode a string
 */
export function decode(str: string): string {
  return atob(str);
}

/**
 * Encode a digest
 */
export function encodeDigest(username: string, password: string): string {
  return btoa([username, password].join(':'));
}

/**
 * Decode a digest
 */
export function decodeDigest(str: string): string[] {
  return atob(str).split(';');
}

