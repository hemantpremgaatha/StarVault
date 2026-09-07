import { createHash, randomBytes } from "node:crypto";

export interface IdentityProof {
  subjectId: string;
  publicKeyFingerprint: string;
  issuedAt: string;
}

export function createSubjectId(): string {
  return `sv_${randomBytes(16).toString("hex")}`;
}

export function fingerprintPublicKey(publicKey: string): string {
  return createHash("sha256").update(publicKey).digest("hex");
}

export function issueIdentityProof(subjectId: string, publicKey: string): IdentityProof {
  return { subjectId, publicKeyFingerprint: fingerprintPublicKey(publicKey), issuedAt: new Date().toISOString() };
}
