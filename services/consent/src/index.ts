export type ConsentStatus = "active" | "revoked" | "expired";

export interface ConsentGrant {
  id: string;
  subjectId: string;
  clientId: string;
  scopes: string[];
  purpose: string;
  issuedAt: string;
  expiresAt: string;
  status: ConsentStatus;
}

export function canAccess(grant: ConsentGrant, scope: string, now = new Date()): boolean {
  return grant.status === "active" &&
    grant.scopes.includes(scope) &&
    new Date(grant.expiresAt).getTime() > now.getTime();
}

export function revokeConsent(grant: ConsentGrant): ConsentGrant {
  return { ...grant, status: "revoked" };
}
