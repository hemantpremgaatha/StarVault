import { describe, expect, it } from "vitest";
import { createSubjectId, fingerprintPublicKey, issueIdentityProof } from "./index.js";

describe("identity", () => {
  it("generates unique subject ids with the sv_ prefix", () => {
    const a = createSubjectId();
    const b = createSubjectId();
    expect(a).toMatch(/^sv_[0-9a-f]{32}$/);
    expect(a).not.toBe(b);
  });

  it("fingerprints the same public key deterministically", () => {
    expect(fingerprintPublicKey("pk-1")).toBe(fingerprintPublicKey("pk-1"));
    expect(fingerprintPublicKey("pk-1")).not.toBe(fingerprintPublicKey("pk-2"));
  });

  it("issues an identity proof bound to the subject and key", () => {
    const proof = issueIdentityProof("sv_abc", "pk-1");
    expect(proof.subjectId).toBe("sv_abc");
    expect(proof.publicKeyFingerprint).toBe(fingerprintPublicKey("pk-1"));
    expect(new Date(proof.issuedAt).toString()).not.toBe("Invalid Date");
  });
});
