import { describe, expect, it } from "vitest";
import { mintCapabilityToken, revokeCapabilityToken, tokenAllows } from "./index.js";
import type { ConsentGrant } from "@starvault/service-consent";

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

describe("gateway", () => {
  it("mints a token that inherits the grant's scope, client and expiry", () => {
    const grant = makeGrant();
    const token = mintCapabilityToken(grant, "profile:read");
    expect(token.subjectId).toBe(grant.subjectId);
    expect(token.clientId).toBe(grant.clientId);
    expect(token.expiresAt).toBe(grant.expiresAt);
    expect(tokenAllows(token, "profile:read")).toBe(true);
  });

  it("refuses to mint a token for a scope the consent grant does not cover", () => {
    const grant = makeGrant();
    expect(() => mintCapabilityToken(grant, "profile:write")).toThrow();
  });

  it("refuses to mint a token from a revoked or expired grant", () => {
    const revoked = makeGrant({ status: "revoked" });
    expect(() => mintCapabilityToken(revoked, "profile:read")).toThrow();
  });

  it("a revoked token no longer allows access", () => {
    const token = mintCapabilityToken(makeGrant(), "profile:read");
    const revoked = revokeCapabilityToken(token);
    expect(tokenAllows(revoked, "profile:read")).toBe(false);
  });
});
