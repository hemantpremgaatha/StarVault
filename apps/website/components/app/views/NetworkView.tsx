import type { VaultState } from "@/lib/vault/types";
import { riskClass } from "@/lib/vault/logic";
import { ApproveButton, cardClass, DangerButton, PrimaryButton, rowClass, SectionHeading } from "../ui";

const CONTRACT = ["POST /consent/request", "POST /tokens/issue", "POST /tokens/revoke", "GET /audit/events", "POST /proofs/identity"];

export function NetworkView({
  state,
  onSimulate,
  onIssueToken,
  onDenyRequest,
  onRevokeToken
}: {
  state: VaultState;
  onSimulate: () => void;
  onIssueToken: (id: string) => void;
  onDenyRequest: (id: string) => void;
  onRevokeToken: (id: string) => void;
}) {
  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="StarVault Network"
        title="Permission gateway for apps, AI systems, and institutions"
        action={<PrimaryButton onClick={onSimulate}>Simulate API request</PrimaryButton>}
      />

      <div className={`${cardClass} grid gap-4 border-emerald-400/25 bg-emerald-400/[0.06] lg:grid-cols-[0.8fr_1.2fr]`}>
        <div>
          <span className="text-xs font-black uppercase text-cyan">User Vault Node</span>
          <strong className="mt-1 block text-2xl font-black text-white">{state.network.nodeId}</strong>
          <p className="mt-2 text-sm text-slate-400">
            Encrypted client-side node that mediates identity facts, records, consent, tokens, and audit logs.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm font-black text-white">
          <span className="rounded-card border border-emerald-400/30 bg-white/10 px-3 py-2.5">Apps</span>
          <i className="h-px w-10 bg-emerald-400/40" />
          <span className="rounded-card border border-emerald-400/30 bg-white/10 px-3 py-2.5">Consent API</span>
          <i className="h-px w-10 bg-emerald-400/40" />
          <span className="rounded-card border border-emerald-400/30 bg-white/10 px-3 py-2.5">Vault Node</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Consent API gateway</p>
          <h3 className="mt-1 text-xl font-black text-white">Incoming access requests</h3>
          <div className="mt-4 grid gap-2">
            {state.network.apiRequests.length ? (
              state.network.apiRequests.map((request) => (
                <div key={request.id} className={rowClass}>
                  <div>
                    <strong className="text-white">{request.requester}</strong>
                    <div className="text-sm font-bold text-slate-400">
                      {request.category} · {request.status}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{request.scope}</p>
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Purpose:</strong> {request.purpose}
                    </p>
                  </div>
                  <div className="grid justify-items-end gap-2">
                    <strong className={riskClass(request.risk)}>{request.risk}</strong>
                    {request.status === "Pending" && <ApproveButton onClick={() => onIssueToken(request.id)}>Issue token</ApproveButton>}
                    {request.status !== "Denied" && request.status !== "Token issued" && (
                      <DangerButton onClick={() => onDenyRequest(request.id)}>Deny</DangerButton>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={rowClass}>
                <strong className="text-white">No pending API requests</strong>
                <span className="text-sm text-slate-400">Gateway idle</span>
              </div>
            )}
          </div>
        </section>

        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Scoped token layer</p>
          <h3 className="mt-1 text-xl font-black text-white">Revocable access grants</h3>
          <div className="mt-4 grid gap-2">
            {state.network.tokens.length ? (
              state.network.tokens.map((token) => (
                <div key={token.id} className={rowClass}>
                  <div>
                    <strong className="text-white">{token.id}</strong>
                    <div className="text-sm font-bold text-slate-400">
                      {token.requester} · {token.status}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{token.scope}</p>
                    <p className="text-sm text-slate-300">
                      <strong className="text-white">Expires:</strong> {new Date(token.expiresAt).toLocaleString()}
                    </p>
                  </div>
                  <DangerButton onClick={() => onRevokeToken(token.id)} disabled={token.status === "Revoked"}>
                    {token.status === "Revoked" ? "Revoked" : "Revoke"}
                  </DangerButton>
                </div>
              ))
            ) : (
              <div className={rowClass}>
                <strong className="text-white">No network tokens</strong>
                <span className="text-sm text-slate-400">Issue a scoped grant</span>
              </div>
            )}
          </div>
        </section>

        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">API contract</p>
          <h3 className="mt-1 text-xl font-black text-white">Network primitives</h3>
          <div className="mt-4 grid gap-2">
            {CONTRACT.map((code) => (
              <code
                key={code}
                className="grid place-items-center rounded-card border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center text-xs text-slate-300"
              >
                {code}
              </code>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
