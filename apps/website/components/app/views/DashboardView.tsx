import type { VaultState, ViewId } from "@/lib/vault/types";
import { extractionAttempts, privacyScore, riskClass } from "@/lib/vault/logic";
import { cardClass, rowClass, SecondaryButton } from "../ui";

export function DashboardView({ state, onJump }: { state: VaultState; onJump: (view: ViewId) => void }) {
  const metrics = [
    { label: "Privacy Score", value: privacyScore(state), hint: "Based on exposed fields, risky permissions, and recent access." },
    { label: "Vault Items", value: state.vault.length, hint: "Encrypted records stored in your personal vault." },
    {
      label: "Active Permissions",
      value: state.permissions.filter((item) => item.status === "Active").length,
      hint: "Apps and companies with current data access."
    },
    {
      label: "Risk Alerts",
      value: state.findings.filter((item) => item.risk !== "Low").length,
      hint: "Scanner findings that deserve attention."
    },
    { label: "Extraction Attempts", value: extractionAttempts(state).length, hint: "Requests flagged as data extraction or profiling." },
    {
      label: "Network Tokens",
      value: state.network.tokens.filter((item) => item.status === "Active").length,
      hint: "Scoped, revocable grants issued through StarVault."
    },
    { label: "Ledger Events", value: state.barrier.ledger.length, hint: "Data transactions recorded for user visibility." }
  ];

  const activePermissions = state.permissions.filter((item) => item.status === "Active").slice(0, 3);
  const findings = state.findings.slice(0, 3);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {metrics.map((metric) => (
          <article key={metric.label} className={cardClass}>
            <span className="text-xs font-bold text-slate-400">{metric.label}</span>
            <strong className="mt-2 block text-3xl font-black text-white">{metric.value}</strong>
            <p className="mt-1 text-xs leading-5 text-slate-400">{metric.hint}</p>
          </article>
        ))}
      </div>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-cyan/25 bg-cyan/[0.06] p-6">
        <div>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Personal data network layer</p>
          <h3 className="mt-1 text-xl font-black text-white">Route data access through consent, scope, expiry, and audit.</h3>
        </div>
        <SecondaryButton onClick={() => onJump("network")}>Open network</SecondaryButton>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-cyan">Immediate hook</p>
              <h3 className="mt-1 text-xl font-black text-white">Who can access your data?</h3>
            </div>
            <SecondaryButton onClick={() => onJump("permissions")}>Review</SecondaryButton>
          </div>
          <div className="mt-4 grid gap-2">
            {activePermissions.length ? (
              activePermissions.map((item) => (
                <div key={item.id} className={rowClass}>
                  <div>
                    <strong className="text-white">{item.company}</strong>
                    <div className="text-sm font-bold text-slate-400">{item.scope}</div>
                  </div>
                  <strong className={riskClass(item.risk)}>{item.risk}</strong>
                </div>
              ))
            ) : (
              <div className={rowClass}>
                <strong className="text-white">No active permissions</strong>
                <span className="text-sm text-slate-400">Clean slate</span>
              </div>
            )}
          </div>
        </section>

        <section className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-cyan">AI privacy scanner</p>
              <h3 className="mt-1 text-xl font-black text-white">Latest findings</h3>
            </div>
            <SecondaryButton onClick={() => onJump("scanner")}>Scan</SecondaryButton>
          </div>
          <div className="mt-4 grid gap-2">
            {findings.length ? (
              findings.map((item) => (
                <div key={item.id} className={rowClass}>
                  <div>
                    <strong className="text-white">{item.title}</strong>
                    <div className="text-sm font-bold text-slate-400">{item.source}</div>
                  </div>
                  <strong className={riskClass(item.risk)}>{item.risk}</strong>
                </div>
              ))
            ) : (
              <div className={rowClass}>
                <strong className="text-white">No scan yet</strong>
                <span className="text-sm text-slate-400">Run the scanner</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
