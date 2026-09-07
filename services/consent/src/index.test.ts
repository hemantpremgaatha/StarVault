import { describe, expect, it } from "vitest";
import { canAccess, revokeConsent, type ConsentGrant } from "./index.js";

function makeGrant(overrides: Partial<ConsentGrant> = {}): ConsentGrant {
  return {
    id: "consent_1",
    subjectId: "sv_1",
    clientId: "client_1",
    scopes: ["profile:read"],
    purpose: "demo",
    issuedAt: new Date(0).toISOString(),
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    status: "active",
    ...overrides,
  };
}

describe("consent", () => {
  it("allows access for an active, unexpired grant covering the scope", () => {
    expect(canAccess(makeGrant(), "profile:read")).toBe(true);
  });

  it("denies access for a scope the grant does not cover", () => {
    expect(canAccess(makeGrant(), "profile:write")).toBe(false);
  });

  it("denies access once the grant has expired", () => {
    const grant = makeGrant({ expiresAt: new Date(Date.now() - 1000).toISOString() });
    expect(canAccess(grant, "profile:read")).toBe(false);
  });

  it("denies access after revocation", () => {
    const revoked = revokeConsent(makeGrant());
    expect(revoked.status).toBe("revoked");
    expect(canAccess(revoked, "profile:read")).toBe(false);
  });
});
