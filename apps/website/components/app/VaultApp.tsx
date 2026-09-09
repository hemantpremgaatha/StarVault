"use client";

import { useRef, useState } from "react";
import { decryptState, deriveVaultKey, encryptState } from "@/lib/vault/crypto";
import {
  advanceNextProtocolLayer,
  appendBarrierLedger,
  completeNextRoadmapMilestone,
  createNextBarrierRequest,
  generateErasureRequests,
  issueNetworkToken,
  migrateState,
  registerProtocolRequest,
  revokeBarrierCapability,
  scanPrivacy,
  simulateApiRequest,
  suppressBroker,
  syncRoadmapWithProtocol,
  verifyBarrierLedger
} from "@/lib/vault/logic";
import type { Identity, VaultState, ViewId } from "@/lib/vault/types";
import { DashboardView } from "./views/DashboardView";
import { VaultView } from "./views/VaultView";
import { IdentityView } from "./views/IdentityView";
import { PermissionsView } from "./views/PermissionsView";
import { BarrierView } from "./views/BarrierView";
import { ProtocolView } from "./views/ProtocolView";
import { RoadmapView } from "./views/RoadmapView";
import { NetworkView } from "./views/NetworkView";
import { SurveillanceView } from "./views/SurveillanceView";
import { ImportsView } from "./views/ImportsView";
import { ScannerView } from "./views/ScannerView";
import { LogsView } from "./views/LogsView";

const NAV: { id: ViewId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vault", label: "Vault" },
  { id: "identity", label: "Identity" },
  { id: "permissions", label: "Permissions" },
  { id: "barrier", label: "Data Barrier" },
  { id: "protocol", label: "Protocol" },
  { id: "roadmap", label: "Roadmap" },
  { id: "network", label: "Network Layer" },
  { id: "surveillance", label: "Surveillance Map" },
  { id: "imports", label: "Imports" },
  { id: "scanner", label: "AI Scanner" },
  { id: "logs", label: "Access Logs" }
];

export function VaultApp() {
  const [state, setState] = useState<VaultState | null>(null);
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const vaultKeyRef = useRef<CryptoKey | null>(null);

  async function handleUnlock(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const key = await deriveVaultKey(passphrase);
      const loaded = await decryptState(key);
      migrateState(loaded);
      loaded.logs = [
        { id: crypto.randomUUID(), action: "Vault unlocked", at: new Date().toISOString() },
        ...loaded.logs
      ].slice(0, 40);
      vaultKeyRef.current = key;
      setState(loaded);
      await encryptState(loaded, key);
    } catch {
      setError("Could not unlock vault. Check your passphrase.");
    } finally {
      setBusy(false);
    }
  }

  function handleLock() {
    vaultKeyRef.current = null;
    setState(null);
    setPassphrase("");
    setActiveView("dashboard");
  }

  async function update(mutator: (draft: VaultState) => string) {
    if (!state || !vaultKeyRef.current) return;
    const draft = structuredClone(state);
    const message = mutator(draft);
    draft.logs = [{ id: crypto.randomUUID(), action: message, at: new Date().toISOString() }, ...draft.logs].slice(0, 40);
    migrateState(draft);
    setState(draft);
    await encryptState(draft, vaultKeyRef.current);
  }

  if (!state) {
    return (
      <section className="mx-auto grid max-w-4xl gap-10 px-6 py-24 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-cyan/80">Secure encrypted storage</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white">Unlock your StarVault</h1>
          <p className="mt-4 max-w-md text-slate-300">
            Create a local encrypted vault with a passphrase. This prototype stores encrypted data in your browser so the MVP can be
            tested without a server.
          </p>
        </div>
        <form onSubmit={handleUnlock} className="grid gap-3 rounded-card border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
          <label className="text-sm font-bold text-slate-400" htmlFor="passphrase">
            Vault passphrase
          </label>
          <input
            id="passphrase"
            type="password"
            minLength={8}
            required
            autoComplete="current-password"
            placeholder="Minimum 8 characters"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            className="w-full rounded-card border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan/50"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-card bg-white px-4 py-2.5 text-sm font-black text-midnight hover:bg-slate-200 disabled:opacity-60"
          >
            {busy ? "Unlocking…" : "Unlock vault"}
          </button>
          {error && <p className="text-sm font-bold text-red-400">{error}</p>}
        </form>
      </section>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/10 bg-midnight p-6 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-card border border-cyan/40 bg-white/5 text-cyan shadow-[0_0_24px_rgba(34,211,238,0.18)]">
            SV
          </span>
          <div>
            <h1 className="text-lg font-black text-white">StarVault</h1>
            <p className="text-xs font-bold text-slate-400">Personal data ownership</p>
          </div>
        </div>
        <nav className="mt-6 grid gap-1.5">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`min-h-[42px] rounded-card px-3.5 text-left text-sm font-bold transition-colors ${
                activeView === item.id ? "bg-cyan/10 text-cyan" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-6 rounded-card border border-white/10 p-4">
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Positioning</p>
          <p className="mt-1 text-sm text-slate-400">Open protocol plus platform for human consent in the AI age.</p>
        </div>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-[73px] z-[2] flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-midnight/90 px-6 py-6 backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-cyan">Network MVP</p>
            <h2 className="mt-1 text-2xl font-black text-white">The consent layer between people and data-hungry systems.</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex min-h-[34px] items-center rounded-card bg-emerald-400/15 px-3 text-sm font-black text-emerald-300">
              Unlocked
            </span>
            <button
              onClick={handleLock}
              className="min-h-[40px] rounded-card border border-white/10 bg-white/5 px-3.5 text-sm font-black text-white hover:bg-white/10"
            >
              Lock
            </button>
          </div>
        </header>

        <section className="p-6">
          {activeView === "dashboard" && <DashboardView state={state} onJump={setActiveView} />}

          {activeView === "vault" && (
            <VaultView
              state={state}
              onAddRecord={(title, category, details) =>
                update((draft) => {
                  draft.vault.unshift({ id: crypto.randomUUID(), title, category, details, createdAt: new Date().toISOString() });
                  return `Added vault record: ${title}`;
                })
              }
              onDeleteRecord={(id) =>
                update((draft) => {
                  const record = draft.vault.find((item) => item.id === id);
                  draft.vault = draft.vault.filter((item) => item.id !== id);
                  return `Deleted vault record: ${record?.title ?? "Unknown"}`;
                })
              }
            />
          )}

          {activeView === "identity" && (
            <IdentityView
              state={state}
              onSave={(identity: Identity) =>
                update((draft) => {
                  draft.identity = identity;
                  return "Updated identity vault";
                })
              }
            />
          )}

          {activeView === "permissions" && (
            <PermissionsView
              state={state}
              onApprove={(id) =>
                update((draft) => {
                  const permission = draft.permissions.find((item) => item.id === id)!;
                  permission.status = "Active";
                  return `Approved permission: ${permission.company}`;
                })
              }
              onRevoke={(id) =>
                update((draft) => {
                  const permission = draft.permissions.find((item) => item.id === id)!;
                  permission.status = "Revoked";
                  return `Revoked permission: ${permission.company}`;
                })
              }
              onLoadSample={() =>
                update((draft) => {
                  draft.permissions.unshift({
                    id: crypto.randomUUID(),
                    company: "HireSignal",
                    scope: "Verified identity, work history, and education claims",
                    purpose: "Hiring platform verification",
                    status: "Pending",
                    risk: "Medium",
                    extractionType: "employment screening",
                    userBenefit: "Job application verification",
                    expiresAt: "2026-07-21"
                  });
                  return "Loaded sample B2B consent request";
                })
              }
            />
          )}

          {activeView === "barrier" && (
            <BarrierView
              state={state}
              onSimulate={() =>
                update((draft) => {
                  createNextBarrierRequest(draft);
                  return "Created new data access barrier request";
                })
              }
              onApprove={() =>
                update((draft) => {
                  const event = appendBarrierLedger(draft, "approved");
                  return `Barrier approved data access: ${event.requesterName}`;
                })
              }
              onDeny={() =>
                update((draft) => {
                  const event = appendBarrierLedger(draft, "denied");
                  return `Barrier denied data access: ${event.requesterName}`;
                })
              }
              onVerify={() => update((draft) => verifyBarrierLedger(draft))}
              onRevokeCapability={(id) =>
                update((draft) => {
                  const event = revokeBarrierCapability(draft, id);
                  return event ? `Barrier revoked data access: ${event.requesterName}` : "Capability not found";
                })
              }
            />
          )}

          {activeView === "protocol" && (
            <ProtocolView
              state={state}
              onAdvance={() =>
                update((draft) => {
                  const layerName = advanceNextProtocolLayer(draft);
                  syncRoadmapWithProtocol(draft, layerName);
                  return `Advanced protocol layer: ${layerName}`;
                })
              }
            />
          )}

          {activeView === "roadmap" && (
            <RoadmapView
              state={state}
              onComplete={() =>
                update((draft) => {
                  const milestone = completeNextRoadmapMilestone(draft);
                  return `Completed roadmap milestone: ${milestone}`;
                })
              }
            />
          )}

          {activeView === "network" && (
            <NetworkView
              state={state}
              onSimulate={() =>
                update((draft) => {
                  simulateApiRequest(draft);
                  return "Received network API consent request";
                })
              }
              onIssueToken={(id) =>
                update((draft) => {
                  const request = draft.network.apiRequests.find((item) => item.id === id)!;
                  const token = issueNetworkToken(draft, request);
                  registerProtocolRequest(draft, request);
                  return `Issued scoped network token: ${token.id}`;
                })
              }
              onDenyRequest={(id) =>
                update((draft) => {
                  const request = draft.network.apiRequests.find((item) => item.id === id)!;
                  request.status = "Denied";
                  return `Denied network request: ${request.requester}`;
                })
              }
              onRevokeToken={(id) =>
                update((draft) => {
                  const token = draft.network.tokens.find((item) => item.id === id)!;
                  token.status = "Revoked";
                  draft.permissions
                    .filter((permission) => permission.company === token.requester && permission.scope === token.scope)
                    .forEach((permission) => {
                      permission.status = "Revoked";
                    });
                  return `Revoked network token: ${token.id}`;
                })
              }
            />
          )}

          {activeView === "surveillance" && (
            <SurveillanceView
              state={state}
              onGenerateErasure={() =>
                update((draft) => {
                  generateErasureRequests(draft);
                  return "Generated data broker erasure requests";
                })
              }
              onSuppressBroker={(id) =>
                update((draft) => {
                  const broker = draft.brokers.find((item) => item.id === id)!;
                  suppressBroker(draft, broker);
                  return `Prepared broker opt-out request: ${broker.name}`;
                })
              }
            />
          )}

          {activeView === "imports" && (
            <ImportsView
              state={state}
              onImport={(source) =>
                update((draft) => {
                  draft.imports.unshift({
                    id: crypto.randomUUID(),
                    source,
                    summary: "Imported metadata and prepared records for encrypted storage.",
                    at: new Date().toISOString()
                  });
                  return `Imported data from ${source}`;
                })
              }
            />
          )}

          {activeView === "scanner" && (
            <ScannerView
              state={state}
              onRunScan={() =>
                update((draft) => {
                  scanPrivacy(draft);
                  return "Ran AI privacy scanner";
                })
              }
            />
          )}

          {activeView === "logs" && <LogsView state={state} />}
        </section>
      </main>
    </div>
  );
}
