import type { VaultState } from "./types";

export function createSeedState(): VaultState {
  return {
    identity: {
      name: "",
      email: "",
      phone: "",
      country: "",
      idStatus: "Not verified",
      consentTerm: "Ask every time"
    },
    vault: [
      {
        id: crypto.randomUUID(),
        title: "Passport backup",
        category: "Identity",
        details: "Encrypted copy reference and renewal reminder.",
        createdAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: "AI chat export",
        category: "AI Training",
        details: "Contains private project notes, personal preferences, and contact mentions.",
        createdAt: new Date().toISOString()
      }
    ],
    permissions: [
      {
        id: crypto.randomUUID(),
        company: "Wellnest Health",
        scope: "Fitness, sleep, and health trend data",
        purpose: "Personalized health recommendations",
        status: "Active",
        risk: "Medium",
        extractionType: "behavioral profiling",
        userBenefit: "Health insights",
        expiresAt: "2026-08-21"
      },
      {
        id: crypto.randomUUID(),
        company: "Credora Finance",
        scope: "Income verification and transaction summaries",
        purpose: "Loan eligibility checks",
        status: "Pending",
        risk: "Low",
        extractionType: "verification",
        userBenefit: "Credit application",
        expiresAt: "2026-06-20"
      },
      {
        id: crypto.randomUUID(),
        company: "ModelForge AI",
        scope: "Chat exports and writing samples",
        purpose: "AI training permission request",
        status: "Active",
        risk: "High",
        extractionType: "AI model training",
        userBenefit: "None disclosed",
        expiresAt: "2026-07-05"
      }
    ],
    barrier: {
      currentRequest: {
        id: crypto.randomUUID(),
        requesterAppId: "sv_app_resumeai",
        requesterName: "ResumeAI",
        resourceType: "Resume",
        purpose: "Candidate screening",
        duration: "2 hours",
        scope: "Read only: education and work history",
        exportAllowed: false,
        aiTrainingAllowed: false,
        status: "Waiting for user decision"
      },
      ledger: [],
      capabilities: [],
      chainStatus: "No ledger events yet"
    },
    network: {
      nodeId: `SVN-${crypto.randomUUID().slice(0, 8)}`,
      apiRequests: [
        {
          id: crypto.randomUUID(),
          requester: "TrialMed AI",
          category: "AI health research",
          scope: "Anonymized sleep trend proof",
          purpose: "Research cohort matching",
          status: "Pending",
          risk: "Medium",
          expiryHours: 24,
          tokenId: null
        },
        {
          id: crypto.randomUUID(),
          requester: "HireSignal",
          category: "Hiring verification",
          scope: "Identity and employment proof",
          purpose: "Candidate verification",
          status: "Pending",
          risk: "Low",
          expiryHours: 72,
          tokenId: null
        }
      ],
      tokens: [
        {
          id: `svt_${crypto.randomUUID().slice(0, 12)}`,
          requester: "Wellnest Health",
          scope: "Fitness trend summary",
          status: "Active",
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
        }
      ]
    },
    protocol: {
      layers: [
        { name: "Identity Layer", priority: "Critical", status: "Started", api: "POST /users, POST /login, GET /me" },
        { name: "Consent Layer", priority: "Critical", status: "Started", api: "POST /consent/request, POST /consent/approve, POST /consent/revoke" },
        { name: "Access Gateway", priority: "Critical", status: "Started", api: "POST /tokens/issue, POST /tokens/revoke" },
        { name: "Vault Layer", priority: "Critical", status: "Started", api: "POST /vault/upload, GET /vault/resource, DELETE /vault/resource" },
        { name: "Policy Engine", priority: "High", status: "Planned", api: "POST /policies/evaluate" },
        { name: "Audit Layer", priority: "Critical", status: "Started", api: "GET /audit/events" },
        { name: "Discovery Layer", priority: "High", status: "Planned", api: "GET /.well-known/starvault" },
        { name: "Federation Layer", priority: "Medium", status: "Planned", api: "POST /federation/handshake" },
        { name: "Cryptography Layer", priority: "Critical", status: "Started", api: "POST /keys/rotate" },
        { name: "Governance Layer", priority: "Medium", status: "Planned", api: "GET /svips" }
      ],
      components: [
        ["Identity Layer", "Critical", "Started"],
        ["Vault Layer", "Critical", "Started"],
        ["Encryption Service", "Critical", "Started"],
        ["Consent Engine", "Critical", "Started"],
        ["Access Gateway", "Critical", "Started"],
        ["Audit Layer", "Critical", "Started"],
        ["Resource Registry", "Critical", "Planned"],
        ["Database Layer", "Critical", "Planned"],
        ["API Gateway", "High", "Planned"],
        ["Developer SDK", "High", "Planned"],
        ["Application Registry", "High", "Planned"],
        ["Event Bus", "High", "Planned"],
        ["DID Support", "Medium", "Planned"],
        ["Distributed Storage", "Medium", "Planned"],
        ["Federation", "Medium", "Planned"],
        ["Blockchain Anchoring", "Low", "Optional"],
        ["AI Context Gateway", "High", "Planned"],
        ["Policy Engine", "High", "Planned"],
        ["Compliance Engine", "High", "Planned"],
        ["Governance", "Medium", "Planned"],
        ["Documentation", "Critical", "Started"]
      ],
      svips: [
        { id: "SVIP-0001", title: "Core consent request format", status: "Draft" },
        { id: "SVIP-0002", title: "Scoped token claims", status: "Draft" },
        { id: "SVIP-0003", title: "Audit event schema", status: "Draft" }
      ]
    },
    roadmap: {
      phases: [
        {
          phase: "Phase 1",
          title: "Core Protocol MVP",
          status: "In progress",
          objective: "Prove the local vault, consent, token, audit, and scanner loop works for normal users.",
          milestones: [
            { title: "Encrypted browser vault", status: "Done" },
            { title: "Identity vault and resource registry", status: "In progress" },
            { title: "Consent request and revoke flow", status: "In progress" },
            { title: "Scoped token simulation", status: "Done" },
            { title: "Audit log and privacy scanner", status: "Done" }
          ],
          metric: "Users can understand and control who accesses their data in under 3 minutes."
        },
        {
          phase: "Phase 2",
          title: "Developer Platform",
          status: "Planned",
          objective: "Let external apps request permission through a stable API and SDK.",
          milestones: [
            { title: "Application registry", status: "Planned" },
            { title: "REST API gateway", status: "Planned" },
            { title: "JavaScript SDK", status: "Planned" },
            { title: "Webhook event system", status: "Planned" },
            { title: "Developer docs and examples", status: "Planned" }
          ],
          metric: "First 3 partner apps can request, receive, and revoke scoped access."
        },
        {
          phase: "Phase 3",
          title: "AI Context Gateway",
          status: "Planned",
          objective: "Make AI agents ask for context through StarVault instead of silently ingesting data.",
          milestones: [
            { title: "AI agent identity", status: "Planned" },
            { title: "Memory permission modes", status: "Planned" },
            { title: "Session-only context grants", status: "Planned" },
            { title: "AI training license requests", status: "Planned" }
          ],
          metric: "AI apps can request calendar, notes, documents, and memory with explicit consent."
        },
        {
          phase: "Phase 4",
          title: "Enterprise and Compliance",
          status: "Planned",
          objective: "Give regulated companies consent, audit, and policy infrastructure they can trust.",
          milestones: [
            { title: "Policy engine", status: "Planned" },
            { title: "Compliance templates", status: "Planned" },
            { title: "Trust score and app reputation", status: "Planned" },
            { title: "SOC 2 readiness checklist", status: "Planned" }
          ],
          metric: "A healthcare, finance, or hiring pilot can pass internal privacy review."
        },
        {
          phase: "Phase 5",
          title: "Federation and Decentralization",
          status: "Planned",
          objective: "Allow multiple StarVault nodes and storage providers to interoperate.",
          milestones: [
            { title: "Discovery document", status: "Planned" },
            { title: "Federation handshake", status: "Planned" },
            { title: "DID and verifiable credential support", status: "Planned" },
            { title: "Optional audit anchoring", status: "Optional" }
          ],
          metric: "Independent StarVault nodes can exchange consent and audit proofs."
        },
        {
          phase: "Phase 6",
          title: "Ecosystem and Marketplace",
          status: "Planned",
          objective: "Turn StarVault into a developer ecosystem with connectors, policies, and governance.",
          milestones: [
            { title: "Connector marketplace", status: "Planned" },
            { title: "Policy marketplace", status: "Planned" },
            { title: "SVIP governance workflow", status: "Planned" },
            { title: "Reference SDKs for Python, Go, Swift, and Java", status: "Planned" }
          ],
          metric: "Developers can build on StarVault without the core team."
        }
      ],
      sprints: [
        ["Weeks 1-2", "Harden MVP state model, resource registry, and consent schema."],
        ["Weeks 3-4", "Create mock REST API contract, SDK examples, and app registry screens."],
        ["Weeks 5-6", "Build first partner demo: hiring or AI training consent workflow."],
        ["Weeks 7-8", "Add policy rules, trust scoring, and erasure request exports."],
        ["Weeks 9-10", "Write whitepaper, SVIP-0001, API docs, and developer quickstart."],
        ["Weeks 11-12", "Recruit pilot users and 2-3 developer partners for feedback."]
      ]
    },
    brokers: [
      {
        id: crypto.randomUUID(),
        name: "AdGraph Exchange",
        category: "Ad-tech profile broker",
        data: "Location, device IDs, browsing interests",
        status: "Unverified",
        risk: "High"
      },
      {
        id: crypto.randomUUID(),
        name: "PeopleSearch Index",
        category: "Identity lookup site",
        data: "Address, phone, relatives, public records",
        status: "Opt-out needed",
        risk: "High"
      },
      {
        id: crypto.randomUUID(),
        name: "Retail Signal Co",
        category: "Purchase analytics network",
        data: "Shopping behavior and loyalty signals",
        status: "Monitoring",
        risk: "Medium"
      }
    ],
    erasureRequests: [],
    imports: [],
    findings: [],
    logs: []
  };
}
