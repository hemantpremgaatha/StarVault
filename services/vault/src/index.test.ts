import { describe, expect, it } from "vitest";
import { createVaultObject } from "./index.js";

describe("vault", () => {
  it("stamps new objects with envelope encryption and a creation timestamp", () => {
    const obj = createVaultObject({
      id: "vault_1",
      subjectId: "sv_1",
      category: "document",
      storageRef: "s3://bucket/key",
    });
    expect(obj.encryption).toBe("envelope-aes-gcm");
    expect(new Date(obj.createdAt).toString()).not.toBe("Invalid Date");
  });
});
