import type { VaultState } from "@/lib/vault/types";
import { riskClass } from "@/lib/vault/logic";
import { cardClass, DangerButton, PrimaryButton, rowClass, SectionHeading } from "../ui";

export function SurveillanceView({
  state,
  onGenerateErasure,
  onSuppressBroker
}: {
  state: VaultState;
  onGenerateErasure: () => void;
  onSuppressBroker: (id: string) => void;
}) {
  const rights: [string, string][] = [
    ["Deny by default", "Companies cannot access sensitive vault data until a request is explicitly approved."],
    ["Purpose limitation", "Every permission must name why data is requested and what benefit the user receives."],
    ["One-click revoke", "Active permissions can be withdrawn and recorded in the audit trail."],
    ["Erasure queue", `${state.erasureRequests.length} broker opt-out or deletion requests prepared.`]
  ];

  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="Surveillance map"
        title="See which actors profit from your data trail"
        action={<PrimaryButton onClick={onGenerateErasure}>Generate erasure requests</PrimaryButton>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Data broker exposure</p>
          <h3 className="mt-1 text-xl font-black text-white">Known extraction surfaces</h3>
          <div className="mt-4 grid gap-2">
            {state.brokers.map((broker) => (
              <div key={broker.id} className={rowClass}>
                <div>
                  <strong className="text-white">{broker.name}</strong>
                  <div className="text-sm font-bold text-slate-400">{broker.category}</div>
                  <p className="mt-1 text-sm text-slate-300">{broker.data}</p>
                </div>
                <div className="grid justify-items-end gap-2">
                  <strong className={riskClass(broker.risk)}>{broker.risk}</strong>
                  <DangerButton onClick={() => onSuppressBroker(broker.id)} disabled={broker.status === "Suppressed"}>
                    {broker.status === "Suppressed" ? "Suppressed" : "Opt out"}
                  </DangerButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Consent ledger</p>
          <h3 className="mt-1 text-xl font-black text-white">User-controlled rights</h3>
          <div className="mt-4 grid gap-3">
            {rights.map(([title, body]) => (
              <article key={title} className="rounded-card border border-white/10 bg-white/[0.03] p-3">
                <strong className="text-sm text-white">{title}</strong>
                <p className="mt-1 text-sm leading-6 text-slate-400">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
