export interface VaultObject {
  id: string;
  subjectId: string;
  category: "identity" | "document" | "preference" | "activity" | "financial" | "health";
  storageRef: string;
  encryption: "envelope-aes-gcm";
  createdAt: string;
}

export interface EnvelopeMetadata {
  algorithm: "AES-256-GCM";
  keyVersion: number;
  nonce: string;
}

/**
 * V3 contract only. Encryption keys must never be persisted in source control.
 * Production implementation will use envelope encryption with KMS/HSM-backed KEKs.
 */
export function createVaultObject(input: Omit<VaultObject, "encryption" | "createdAt">): VaultObject {
  return { ...input, encryption: "envelope-aes-gcm", createdAt: new Date().toISOString() };
}
