import type { VaultState } from "@/lib/vault/types";
import { ApproveButton, cardClass, DangerButton, PrimaryButton, rowClass, SecondaryButton, SectionHeading } from "../ui";

export function BarrierView({
  state,
  onSimulate,
  onApprove,
  onDeny,
  onVerify,
  onRevokeCapability
}: {
  state: VaultState;
  onSimulate: () => void;
  onApprove: () => void;
  onDeny: () => void;
  onVerify: () => void;
  onRevokeCapability: (id: string) => void;
}) {
  const request = state.barrier.currentRequest;
  const risky = request.exportAllowed || request.aiTrainingAllowed;

  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="Data access barrier"
        title="No party touches user data directly"
        action={<PrimaryButton onClick={onSimulate}>Simulate data request</PrimaryButton>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <article className={`${cardClass} grid gap-2`}>
          <span className="text-xs font-black uppercase text-cyan">User Data</span>
          <strong className="text-lg text-white">Encrypted Vault</strong>
          <p className="text-sm text-slate-400">Identity, documents, health, finance, AI memory, and personal records.</p>
        </article>
        <article className={`${cardClass} grid gap-2 border-emerald-400/30 bg-emerald-400/[0.06]`}>
          <span className="text-xs font-black uppercase text-cyan">StarVault Barrier</span>
          <strong className="text-lg text-white">Consent + Policy + Token + Ledger</strong>
          <p className="text-sm text-slate-400">Every access is checked, limited, recorded, and revocable.</p>
        </article>
        <article className={`${cardClass} grid gap-2`}>
          <span className="text-xs font-black uppercase text-cyan">Requester</span>
          <strong className="text-lg text-white">App / AI / Company</strong>
          <p className="text-sm text-slate-400">Receives only the capability the user approved.</p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Pending transaction</p>
          <h3 className="mt-1 text-xl font-black text-white">Request details</h3>
          <article className="mt-4 grid gap-2">
            <span className="text-xs font-bold text-slate-400">{request.status}</span>
            <strong className="text-lg text-white">{request.requesterName}</strong>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Resource:</strong> {request.resourceType}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Purpose:</strong> {request.purpose}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Duration:</strong> {request.duration}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Scope:</strong> {request.scope}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Export:</strong> {request.exportAllowed ? "Requested" : "Blocked"}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">AI training:</strong> {request.aiTrainingAllowed ? "Requested" : "Blocked"}
            </p>
            <div className="flex flex-wrap gap-2">
              <ApproveButton onClick={onApprove}>Approve limited access</ApproveButton>
              <DangerButton onClick={onDeny}>{risky ? "Deny risky request" : "Deny"}</DangerButton>
            </div>
          </article>
        </section>

        <section className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-cyan">Hyperledger-style audit</p>
              <h3 className="mt-1 text-xl font-black text-white">Ledger events</h3>
            </div>
            <SecondaryButton onClick={onVerify}>Verify chain</SecondaryButton>
          </div>
          <div className="mt-4 grid gap-2">
            {state.barrier.ledger.length ? (
              state.barrier.ledger.map((event) => (
                <div key={event.id} className={rowClass}>
                  <div>
                    <strong className="text-white">
                      {event.decision.toUpperCase()} - {event.requesterName}
                    </strong>
                    <div className="text-sm font-bold text-slate-400">
                      {event.resourceType} | {event.scope}
                    </div>
                    <div className="text-xs text-slate-500">
                      tx {event.id} | hash {event.eventHash}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className={rowClass}>
                <strong className="text-white">No data transactions yet</strong>
                <span className="text-sm text-slate-400">Run a request</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className={cardClass}>
        <p className="text-xs font-black uppercase tracking-normal text-cyan">Active capabilities</p>
        <h3 className="mt-1 text-xl font-black text-white">Current data access grants</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.barrier.capabilities.length ? (
            state.barrier.capabilities.map((capability) => (
              <article key={capability.id} className={`${cardClass} grid gap-2`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400">
                      {capability.status} until {new Date(capability.expiresAt).toLocaleString()}
                    </span>
                    <h3 className="text-lg font-black text-white">{capability.requesterName}</h3>
                  </div>
                  <strong className="text-sm text-slate-300">{capability.resourceType}</strong>
                </div>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Purpose:</strong> {capability.purpose}
                </p>
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Scope:</strong> {capability.scope}
                </p>
                <p className="text-xs text-slate-500">Token: {capability.id}</p>
                {capability.status === "Active" && (
                  <div>
                    <DangerButton onClick={() => onRevokeCapability(capability.id)}>Revoke access</DangerButton>
                  </div>
                )}
              </article>
            ))
          ) : (
            <article className={`${cardClass} grid gap-2`}>
              <span className="text-sm text-slate-400">{state.barrier.chainStatus}</span>
              <h3 className="text-lg font-black text-white">No active capabilities</h3>
              <p className="text-sm text-slate-400">Approve a request to issue a temporary access grant.</p>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
