import { randomUUID } from "node:crypto";
import type { ConsentGrant } from "@starvault/service-consent";
import { canAccess } from "@starvault/service-consent";

export interface CapabilityToken {
  tokenId: string;
  subjectId: string;
  clientId: string;
  scopes: string[];
  purpose: string;
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export function tokenAllows(token: CapabilityToken, scope: string, now = new Date()): boolean {
  return !token.revokedAt && token.scopes.includes(scope) && new Date(token.expiresAt).getTime() > now.getTime();
}

/**
 * A capability token may only be minted from an active consent grant, and it
 * inherits that grant's scope, purpose and expiry rather than defining its own.
 */
export function mintCapabilityToken(grant: ConsentGrant, scope: string, now = new Date()): CapabilityToken {
  if (!canAccess(grant, scope, now)) {
    throw new Error(`Consent grant ${grant.id} does not authorize scope "${scope}"`);
  }
  return {
    tokenId: `cap_${randomUUID()}`,
    subjectId: grant.subjectId,
    clientId: grant.clientId,
    scopes: [scope],
    purpose: grant.purpose,
    issuedAt: now.toISOString(),
    expiresAt: grant.expiresAt,
  };
}

export function revokeCapabilityToken(token: CapabilityToken, now = new Date()): CapabilityToken {
  return { ...token, revokedAt: now.toISOString() };
}
