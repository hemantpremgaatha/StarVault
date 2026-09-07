import { describe, expect, it } from "vitest";
import { createAuditEvent } from "./index.js";

describe("audit", () => {
  it("assigns a unique id and timestamp to every event", () => {
    const a = createAuditEvent({ actorId: "sv_1", subjectId: "sv_1", action: "identity.issued" });
    const b = createAuditEvent({ actorId: "sv_1", subjectId: "sv_1", action: "identity.issued" });
    expect(a.id).not.toBe(b.id);
    expect(new Date(a.timestamp).toString()).not.toBe("Invalid Date");
  });
});
