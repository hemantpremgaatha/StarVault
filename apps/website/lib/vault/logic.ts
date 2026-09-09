import type {
  ApiRequest,
  Barrier,
  BarrierRequest,
  Broker,
  Capability,
  LedgerEvent,
  NetworkToken,
  Permission,
  Risk,
  VaultState
} from "./types";

export function riskClass(risk: Risk): string {
  switch (risk) {
    case "High":
      return "text-red-400";
    case "Medium":
      return "text-amber-300";
    default:
      return "text-electric-blue";
  }
}

export function statusClass(status: string): string {
  const value = status.toLowerCase();
  if (value === "planned") return "text-red-400";
  if (value === "draft" || value === "optional") return "text-amber-300";
  if (value === "started" || value === "done") return "text-emerald-400";
  if (value === "in progress") return "text-amber-300";
  return "text-slate-300";
}

export function priorityClass(priority: string): string {
  const value = priority.toLowerCase();
  if (value === "critical") return "text-red-400";
  if (value === "high") return "text-amber-300";
  return "text-electric-blue";
}

export function migrateState(state: VaultState): VaultState {
  state.permissions.forEach((permission) => {
    permission.extractionType ??= permission.risk === "High" ? "data extraction" : "verification";
    permission.userBenefit ??= permission.risk === "High" ? "None disclosed" : "Service access";
  });
  return state;
}

export function extractionAttempts(state: VaultState): Permission[] {
  return state.permissions.filter((item) => {
    const noBenefit = item.userBenefit === "None disclosed";
    const extraction = /training|profiling|advertising|extraction/i.test(item.extractionType);
    return item.status !== "Revoked" && (item.risk === "High" || noBenefit || extraction);
  });
}

export function privacyScore(state: VaultState): number {
  const activeHighRisk = state.permissions.filter((item) => item.status === "Active" && item.risk === "High").length;
  const findings = state.findings.filter((item) => item.risk !== "Low").length;
  const brokerRisk = state.brokers.filter((item) => item.risk === "High" && item.status !== "Suppressed").length;
  const activeTokens = state.network.tokens.filter((item) => item.status === "Active").length;
  const score =
    96 -
    activeHighRisk * 16 -
    findings * 7 -
    brokerRisk * 6 -
    Math.max(0, activeTokens - 3) * 3 -
    Math.max(0, state.permissions.length - 4) * 3;
  return Math.max(35, score);
}

function hashText(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return `svh_${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

type LedgerOverride = Partial<
  Pick<LedgerEvent, "tokenId" | "requesterAppId" | "requesterName" | "resourceType" | "purpose" | "scope" | "consentId">
>;

export function appendBarrierLedger(state: VaultState, decision: LedgerEvent["decision"], override: LedgerOverride = {}): LedgerEvent {
  const barrier = state.barrier;
  const request = barrier.currentRequest;
  const previousHash = barrier.ledger[0]?.eventHash ?? "genesis";
  const tokenId = override.tokenId ?? (decision === "approved" ? `svt_${crypto.randomUUID().slice(0, 12)}` : null);
  const event: LedgerEvent = {
    id: `svtx_${crypto.randomUUID().slice(0, 12)}`,
    userHash: hashText(state.identity.email || state.identity.name || "local-user"),
    requesterAppId: override.requesterAppId ?? request.requesterAppId,
    requesterName: override.requesterName ?? request.requesterName,
    resourceType: override.resourceType ?? request.resourceType,
    purpose: override.purpose ?? request.purpose,
    scope: override.scope ?? request.scope,
    consentId: override.consentId ?? request.id,
    tokenId,
    decision,
    ledgerNetwork: "local hyperledger-style ledger",
    previousHash,
    createdAt: new Date().toISOString(),
    eventHash: ""
  };
  event.eventHash = hashText(JSON.stringify(event));
  barrier.ledger.unshift(event);
  request.status = decision === "approved" ? "Approved and tokenized" : "Denied by user";
  if (tokenId) {
    const capability: Capability = {
      id: tokenId,
      requesterAppId: request.requesterAppId,
      requesterName: request.requesterName,
      resourceType: request.resourceType,
      purpose: request.purpose,
      scope: request.scope,
      status: "Active",
      issuedAt: event.createdAt,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
    };
    barrier.capabilities.unshift(capability);
    state.network.tokens.unshift({
      id: tokenId,
      requester: request.requesterName,
      scope: request.scope,
      status: "Active",
      issuedAt: event.createdAt,
      expiresAt: capability.expiresAt
    });
  }
  return event;
}

export function revokeBarrierCapability(state: VaultState, tokenId: string): LedgerEvent | null {
  const capability = state.barrier.capabilities.find((item) => item.id === tokenId);
  if (!capability) return null;
  capability.status = "Revoked";
  state.network.tokens
    .filter((token) => token.id === tokenId)
    .forEach((token) => {
      token.status = "Revoked";
    });
  return appendBarrierLedger(state, "revoked", {
    tokenId,
    requesterAppId: capability.requesterAppId,
    requesterName: capability.requesterName,
    resourceType: capability.resourceType,
    purpose: capability.purpose,
    scope: capability.scope,
    consentId: tokenId
  });
}

export function verifyBarrierLedger(state: VaultState): string {
  const ledger = state.barrier.ledger;
  if (!ledger.length) {
    state.barrier.chainStatus = "No ledger events yet";
    return state.barrier.chainStatus;
  }
  const valid = ledger.every((event, index) => {
    const expectedPrevious = ledger[index + 1]?.eventHash ?? "genesis";
    return event.previousHash === expectedPrevious;
  });
  state.barrier.chainStatus = valid ? "Ledger hash chain verified" : "Ledger chain mismatch detected";
  return state.barrier.chainStatus;
}

const BARRIER_SAMPLES: Omit<BarrierRequest, "id" | "status">[] = [
  {
    requesterAppId: "sv_app_resumeai",
    requesterName: "ResumeAI",
    resourceType: "Resume",
    purpose: "Candidate screening",
    duration: "2 hours",
    scope: "Read only: education and work history",
    exportAllowed: false,
    aiTrainingAllowed: false
  },
  {
    requesterAppId: "sv_app_healthstudy",
    requesterName: "Cancer Research Network",
    resourceType: "Medical Records",
    purpose: "Anonymized research eligibility",
    duration: "24 hours",
    scope: "Proof only: eligibility signals, no raw records",
    exportAllowed: false,
    aiTrainingAllowed: false
  },
  {
    requesterAppId: "sv_app_modelforge",
    requesterName: "ModelForge AI",
    resourceType: "AI Memory",
    purpose: "Training data collection",
    duration: "30 days",
    scope: "Broad read request",
    exportAllowed: true,
    aiTrainingAllowed: true
  }
];

export function createNextBarrierRequest(state: VaultState): void {
  const sample = BARRIER_SAMPLES[Math.floor(Math.random() * BARRIER_SAMPLES.length)];
  state.barrier.currentRequest = {
    id: crypto.randomUUID(),
    status: "Waiting for user decision",
    ...sample
  };
}

export function advanceNextProtocolLayer(state: VaultState): string {
  const plannedLayer = state.protocol.layers.find((layer) => layer.status === "Planned");
  if (plannedLayer) {
    plannedLayer.status = "Started";
    const component = state.protocol.components.find(
      ([name]) => name === plannedLayer.name || name.includes(plannedLayer.name.split(" ")[0])
    );
    if (component && component[2] === "Planned") component[2] = "Started";
    return plannedLayer.name;
  }
  return "All MVP protocol layers";
}

export function registerProtocolRequest(state: VaultState, request: ApiRequest): void {
  state.protocol.svips.unshift({
    id: `SVIP-${String(state.protocol.svips.length + 1).padStart(4, "0")}`,
    title: `${request.category} access profile for ${request.requester}`,
    status: "Draft"
  });
}

export function completeNextRoadmapMilestone(state: VaultState): string {
  for (const phase of state.roadmap.phases) {
    const milestone = phase.milestones.find((item) => item.status !== "Done" && item.status !== "Optional");
    if (milestone) {
      milestone.status = "Done";
      const unfinished = phase.milestones.some((item) => item.status !== "Done" && item.status !== "Optional");
      phase.status = unfinished ? "In progress" : "Done";
      return `${phase.title}: ${milestone.title}`;
    }
  }
  return "All roadmap milestones";
}

export function syncRoadmapWithProtocol(state: VaultState, layerName: string): void {
  const phase = state.roadmap.phases.find((item) => item.title === "Core Protocol MVP");
  const match = phase?.milestones.find((milestone) =>
    layerName.toLowerCase().includes(milestone.title.split(" ")[0].toLowerCase())
  );
  if (match && match.status !== "Done") match.status = "In progress";
}

export function issueNetworkToken(state: VaultState, request: ApiRequest): NetworkToken {
  const token: NetworkToken = {
    id: `svt_${crypto.randomUUID().slice(0, 12)}`,
    requester: request.requester,
    scope: request.scope,
    status: "Active",
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * request.expiryHours).toISOString()
  };
  request.status = "Token issued";
  request.tokenId = token.id;
  state.network.tokens.unshift(token);
  state.permissions.unshift({
    id: crypto.randomUUID(),
    company: request.requester,
    scope: request.scope,
    purpose: request.purpose,
    status: "Active",
    risk: request.risk,
    extractionType: request.category,
    userBenefit: "Network-mediated access with revocation",
    expiresAt: token.expiresAt.slice(0, 10)
  });
  return token;
}

const API_REQUEST_SAMPLES: Omit<ApiRequest, "id" | "status" | "tokenId">[] = [
  {
    requester: "ModelForge Labs",
    category: "AI model training",
    scope: "Writing samples and preference signals",
    purpose: "Training dataset licensing request",
    risk: "High",
    expiryHours: 12
  },
  {
    requester: "Credora Finance",
    category: "Financial verification",
    scope: "Income proof without transaction history",
    purpose: "Loan underwriting",
    risk: "Low",
    expiryHours: 48
  },
  {
    requester: "Civic Research Cloud",
    category: "Public-interest research",
    scope: "Anonymized mobility pattern proof",
    purpose: "Urban planning study",
    risk: "Medium",
    expiryHours: 24
  }
];

export function simulateApiRequest(state: VaultState): void {
  const sample = API_REQUEST_SAMPLES[Math.floor(Math.random() * API_REQUEST_SAMPLES.length)];
  state.network.apiRequests.unshift({
    id: crypto.randomUUID(),
    status: "Pending",
    tokenId: null,
    ...sample
  });
}

export function suppressBroker(state: VaultState, broker: Broker): void {
  broker.status = "Suppressed";
  state.erasureRequests.unshift({
    id: crypto.randomUUID(),
    target: broker.name,
    data: broker.data,
    at: new Date().toISOString()
  });
}

export function generateErasureRequests(state: VaultState): void {
  state.brokers
    .filter((broker) => broker.status !== "Suppressed")
    .forEach((broker) => {
      state.erasureRequests.unshift({
        id: crypto.randomUUID(),
        target: broker.name,
        data: broker.data,
        at: new Date().toISOString()
      });
      broker.status = "Opt-out drafted";
    });
}

export function scanPrivacy(state: VaultState): void {
  const findings: VaultState["findings"] = [];
  state.vault.forEach((item) => {
    const text = `${item.title} ${item.details}`.toLowerCase();
    if (text.includes("passport") || text.includes("government") || text.includes("id")) {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "Government identity data detected",
        source: item.title,
        description: "Keep this encrypted and only share through time-limited verified consent."
      });
    }
    if (text.includes("chat") || text.includes("ai") || text.includes("preferences")) {
      findings.push({
        id: crypto.randomUUID(),
        risk: "Medium",
        title: "AI training-sensitive text found",
        source: item.title,
        description: "This record may reveal preferences, writing style, contacts, or private project details."
      });
    }
  });
  state.permissions.forEach((permission) => {
    if (permission.status === "Active" && permission.risk === "High") {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "High-risk active permission",
        source: permission.company,
        description: "Review this permission and revoke it if the purpose no longer serves you."
      });
    }
    if (permission.status !== "Revoked" && permission.userBenefit === "None disclosed") {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "Extraction without user benefit",
        source: permission.company,
        description: "This request asks for valuable personal data without disclosing a meaningful benefit to the user."
      });
    }
  });
  state.brokers.forEach((broker) => {
    if (broker.status !== "Suppressed" && broker.risk === "High") {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "Possible broker exposure",
        source: broker.name,
        description: `${broker.category} may expose ${broker.data.toLowerCase()}. Prepare an opt-out or deletion request.`
      });
    }
  });
  state.findings = findings.length
    ? findings
    : [
        {
          id: crypto.randomUUID(),
          risk: "Low",
          title: "No sensitive exposure found",
          source: "StarVault scanner",
          description: "Current vault records and permissions look low risk."
        }
      ];
}
