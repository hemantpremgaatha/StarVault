import type { VaultState } from "./types";
import { createSeedState } from "./seed";

const STORAGE_KEY = "starvault.encrypted.v1";
const SALT_KEY = "starvault.salt.v1";

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToBase64(bytes: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

async function getSalt(): Promise<Uint8Array<ArrayBuffer>> {
  const existing = localStorage.getItem(SALT_KEY);
  if (existing) return base64ToBytes(existing);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, bytesToBase64(salt));
  return salt;
}

export async function deriveVaultKey(passphrase: string): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: await getSalt(), iterations: 210000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptState(state: VaultState, vaultKey: CryptoKey): Promise<void> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const payload = enc.encode(JSON.stringify(state));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, vaultKey, payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ iv: bytesToBase64(iv), data: bytesToBase64(ciphertext) }));
}

export async function decryptState(vaultKey: CryptoKey): Promise<VaultState> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return createSeedState();
  const parsed = JSON.parse(stored) as { iv: string; data: string };
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(parsed.iv) },
    vaultKey,
    base64ToBytes(parsed.data)
  );
  return JSON.parse(dec.decode(plaintext)) as VaultState;
}
