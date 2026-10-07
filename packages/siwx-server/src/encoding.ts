/**
 * @file base64url helpers (RFC 4648 §5, without padding) shared by the signed demo tokens and the JWTs.
 */

/**
 * Encodes bytes as base64url without padding.
 * @internal
 */
export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes base64url (with or without padding) to bytes.
 * @throws {DOMException} If the input is not valid base64url.
 * @internal
 */
export function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes text as UTF-8, then as base64url without padding.
 * @internal
 */
export function utf8ToBase64Url(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

/**
 * Decodes base64url, then the bytes as UTF-8.
 * @throws {DOMException} If the input is not valid base64url.
 * @internal
 */
export function base64UrlToUtf8(value: string): string {
  return new TextDecoder().decode(base64UrlToBytes(value));
}
