export type Risk = "Low" | "Medium" | "High";

export type Identity = {
  name: string;
  email: string;
  phone: string;
  country: string;
  idStatus: string;
  consentTerm: string;
};

export type VaultRecord = {
  id: string;
  title: string;
  category: string;
  details: string;
  createdAt: string;
};

export type Permission = {
  id: string;
  company: string;
  scope: string;
  purpose: string;
  status: "Active" | "Pending" | "Revoked";
  risk: Risk;
  extractionType: string;
  userBenefit: string;
  expiresAt: string;
};

export type BarrierRequest = {
  id: string;
  requesterAppId: string;
  requesterName: string;
  resourceType: string;
  purpose: string;
  duration: string;
  scope: string;
  exportAllowed: boolean;
  aiTrainingAllowed: boolean;
  status: string;
};

export type LedgerEvent = {
  id: string;
  userHash: string;
  requesterAppId: string;
  requesterName: string;
  resourceType: string;
  purpose: string;
  scope: string;
  consentId: string;
  tokenId: string | null;
  decision: "approved" | "denied" | "revoked";
  ledgerNetwork: string;
  previousHash: string;
  createdAt: string;
  eventHash: string;
};

export type Capability = {
  id: string;
  requesterAppId: string;
  requesterName: string;
  resourceType: string;
  purpose: string;
  scope: string;
  status: "Active" | "Revoked";
  issuedAt: string;
  expiresAt: string;
};

export type Barrier = {
  currentRequest: BarrierRequest;
  ledger: LedgerEvent[];
  capabilities: Capability[];
  chainStatus: string;
};

export type NetworkToken = {
  id: string;
  requester: string;
  scope: string;
  status: "Active" | "Revoked";
  issuedAt: string;
  expiresAt: string;
};

export type ApiRequest = {
  id: string;
  requester: string;
  category: string;
  scope: string;
  purpose: string;
  status: "Pending" | "Token issued" | "Denied";
  risk: Risk;
  expiryHours: number;
  tokenId: string | null;
};

export type NetworkState = {
  nodeId: string;
  apiRequests: ApiRequest[];
  tokens: NetworkToken[];
};

export type ProtocolLayer = {
  name: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Started" | "Planned";
  api: string;
};

export type ProtocolComponent = [name: string, priority: string, status: string];

export type Svip = {
  id: string;
  title: string;
  status: string;
};

export type ProtocolState = {
  layers: ProtocolLayer[];
  components: ProtocolComponent[];
  svips: Svip[];
};

export type RoadmapMilestone = {
  title: string;
  status: "Done" | "In progress" | "Planned" | "Optional";
};

export type RoadmapPhase = {
  phase: string;
  title: string;
  status: "Done" | "In progress" | "Planned";
  objective: string;
  milestones: RoadmapMilestone[];
  metric: string;
};

export type RoadmapState = {
  phases: RoadmapPhase[];
  sprints: [period: string, task: string][];
};

export type Broker = {
  id: string;
  name: string;
  category: string;
  data: string;
  status: string;
  risk: Risk;
};

export type ErasureRequest = {
  id: string;
  target: string;
  data: string;
  at: string;
};

export type ImportRecord = {
  id: string;
  source: string;
  summary: string;
  at: string;
};

export type Finding = {
  id: string;
  risk: Risk;
  title: string;
  source: string;
  description: string;
};

export type LogEntry = {
  id: string;
  action: string;
  at: string;
};

export type VaultState = {
  identity: Identity;
  vault: VaultRecord[];
  permissions: Permission[];
  barrier: Barrier;
  network: NetworkState;
  protocol: ProtocolState;
  roadmap: RoadmapState;
  brokers: Broker[];
  erasureRequests: ErasureRequest[];
  imports: ImportRecord[];
  findings: Finding[];
  logs: LogEntry[];
};

export type ViewId =
  | "dashboard"
  | "vault"
  | "identity"
  | "permissions"
  | "barrier"
  | "protocol"
  | "roadmap"
  | "network"
  | "surveillance"
  | "imports"
  | "scanner"
  | "logs";
