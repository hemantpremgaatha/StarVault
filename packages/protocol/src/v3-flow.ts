import { randomUUID } from "node:crypto";
import { createSubjectId, issueIdentityProof, type IdentityProof } from "@starvault/service-identity";
import { createVaultObject, type VaultObject } from "@starvault/service-vault";
import { canAccess, revokeConsent, type ConsentGrant } from "@starvault/service-consent";
import { mintCapabilityToken, revokeCapabilityToken, tokenAllows, type CapabilityToken } from "@starvault/service-gateway";
import { createAuditEvent, type AuditEvent } from "@starvault/service-audit";

export interface AccessGrantResult {
  identity: IdentityProof;
  vaultObject: VaultObject;
  consent: ConsentGrant;
  token: CapabilityToken;
  auditTrail: AuditEvent[];
}

export interface RequestAccessInput {
  publicKey: string;
  clientId: string;
  purpose: string;
  scope: string;
  category: VaultObject["category"];
  storageRef: string;
  expiresAt: string;
}

/**
 * Walks the V3 core trust model end to end: Identity -> Vault -> Consent ->
 * Capability Gateway -> Audit. Throws if the requested scope is not covered
 * by the consent grant it creates.
 */
export function establishAccess(input: RequestAccessInput, now = new Date()): AccessGrantResult {
  const subjectId = createSubjectId();
  const identity = issueIdentityProof(subjectId, input.publicKey);
  const auditTrail: AuditEvent[] = [
    createAuditEvent({ actorId: subjectId, subjectId, action: "identity.issued" }),
  ];

  const vaultObject = createVaultObject({
    id: `vault_${randomUUID()}`,
    subjectId,
    category: input.category,
    storageRef: input.storageRef,
  });

  const consent: ConsentGrant = {
    id: `consent_${randomUUID()}`,
    subjectId,
    clientId: input.clientId,
    scopes: [input.scope],
    purpose: input.purpose,
    issuedAt: now.toISOString(),
    expiresAt: input.expiresAt,
    status: "active",
  };
  auditTrail.push(createAuditEvent({ actorId: subjectId, subjectId, action: "consent.created", resource: consent.id }));

  const token = mintCapabilityToken(consent, input.scope, now);
  auditTrail.push(createAuditEvent({
    actorId: input.clientId,
    subjectId,
    action: "data.accessed",
    resource: vaultObject.id,
    metadata: { tokenId: token.tokenId, scope: input.scope },
  }));

  return { identity, vaultObject, consent, token, auditTrail };
}

export interface RevokeAccessResult {
  consent: ConsentGrant;
  token: CapabilityToken;
  auditEvent: AuditEvent;
}

/** Revocation invalidates both the consent grant and the capability token it backed. */
export function revokeAccess(consent: ConsentGrant, token: CapabilityToken, now = new Date()): RevokeAccessResult {
  const revokedConsent = revokeConsent(consent);
  const revokedToken = revokeCapabilityToken(token, now);
  const auditEvent = createAuditEvent({
    actorId: consent.subjectId,
    subjectId: consent.subjectId,
    action: "consent.revoked",
    resource: consent.id,
  });
  return { consent: revokedConsent, token: revokedToken, auditEvent };
}

export function canStillAccess(consent: ConsentGrant, token: CapabilityToken, scope: string, now = new Date()): boolean {
  return canAccess(consent, scope, now) && tokenAllows(token, scope, now);
}
