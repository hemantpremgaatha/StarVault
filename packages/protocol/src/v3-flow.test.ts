import { describe, expect, it } from "vitest";
import { canStillAccess, establishAccess, revokeAccess } from "./v3-flow.js";

function baseInput() {
  return {
    publicKey: "pk-1",
    clientId: "client_1",
    purpose: "budgeting insights",
    scope: "finance:read",
    category: "financial" as const,
    storageRef: "s3://vault/obj-1",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
}

describe("v3 core trust model flow", () => {
  it("walks identity -> vault -> consent -> gateway -> audit and grants access", () => {
    const result = establishAccess(baseInput());

    expect(result.identity.subjectId).toBe(result.vaultObject.subjectId);
    expect(result.identity.subjectId).toBe(result.consent.subjectId);
    expect(result.token.subjectId).toBe(result.identity.subjectId);
    expect(result.token.scopes).toContain("finance:read");
    expect(result.auditTrail.map((e) => e.action)).toEqual([
      "identity.issued",
      "consent.created",
      "data.accessed",
    ]);
    expect(canStillAccess(result.consent, result.token, "finance:read")).toBe(true);
  });

  it("revocation immediately invalidates both consent and the capability token", () => {
    const result = establishAccess(baseInput());
    const revoked = revokeAccess(result.consent, result.token);

    expect(revoked.consent.status).toBe("revoked");
    expect(revoked.token.revokedAt).toBeDefined();
    expect(revoked.auditEvent.action).toBe("consent.revoked");
    expect(canStillAccess(revoked.consent, revoked.token, "finance:read")).toBe(false);
  });
});
