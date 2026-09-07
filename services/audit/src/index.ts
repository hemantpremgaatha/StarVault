export type AuditAction = "consent.created" | "consent.revoked" | "data.accessed" | "identity.issued";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  subjectId: string;
  action: AuditAction;
  resource?: string;
  metadata?: Record<string, string>;
}

export function createAuditEvent(input: Omit<AuditEvent, "id" | "timestamp">): AuditEvent {
  return {
    ...input,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}
