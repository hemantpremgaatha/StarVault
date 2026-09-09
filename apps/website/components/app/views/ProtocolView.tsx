import type { VaultState } from "@/lib/vault/types";
import { priorityClass, statusClass } from "@/lib/vault/logic";
import { cardClass, PrimaryButton, rowClass, SectionHeading } from "../ui";

export function ProtocolView({ state, onAdvance }: { state: VaultState; onAdvance: () => void }) {
  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="StarVault Protocol"
        title="Open protocol, reference platform, developer ecosystem"
        action={<PrimaryButton onClick={onAdvance}>Advance next layer</PrimaryButton>}
      />

      <div className="grid gap-3">
        <div className="rounded-card border border-emerald-400/25 bg-emerald-400/[0.06] p-4 text-center text-sm font-black text-white">
          Applications: AI, healthcare, finance, HR, social
        </div>
        <div className="rounded-card border border-white/10 bg-white/[0.03] p-4 text-center text-sm font-black text-white">
          Developer SDKs: Python, JavaScript, Java, Go, Swift
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {state.protocol.layers.map((layer) => (
            <article key={layer.name} className={`${cardClass} grid min-h-[150px] gap-2`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-black uppercase ${priorityClass(layer.priority)}`}>{layer.priority}</span>
                <strong className="text-right text-sm text-white">{layer.name}</strong>
              </div>
              <p className="text-xs leading-5 text-slate-400">{layer.api}</p>
              <em className={`text-xs font-black uppercase not-italic ${statusClass(layer.status)}`}>{layer.status}</em>
            </article>
          ))}
        </div>
        <div className="rounded-card border border-amber-300/25 bg-amber-300/[0.06] p-4 text-center text-sm font-black text-white">
          Storage providers: local, cloud, IPFS, enterprise
        </div>
        <div className="rounded-card border border-white/10 bg-white/10 p-4 text-center text-sm font-black text-white">Internet</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Component status</p>
          <h3 className="mt-1 text-xl font-black text-white">From MVP to ecosystem</h3>
          <div className="mt-4 grid gap-2">
            {state.protocol.components.map(([component, priority, status]) => (
              <div key={component} className="grid grid-cols-[minmax(140px,1fr)_80px_80px] items-center gap-2 rounded-card border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <strong className="text-sm text-white">{component}</strong>
                <span className={`text-xs font-black uppercase ${priorityClass(priority)}`}>{priority}</span>
                <em className={`text-xs font-black uppercase not-italic ${statusClass(status)}`}>{status}</em>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <p className="text-xs font-black uppercase tracking-normal text-cyan">Protocol governance</p>
          <h3 className="mt-1 text-xl font-black text-white">SVIP proposals</h3>
          <div className="mt-4 grid gap-2">
            {state.protocol.svips.map((svip) => (
              <div key={svip.id} className={rowClass}>
                <div>
                  <strong className="text-white">{svip.id}</strong>
                  <div className="text-sm font-bold text-slate-400">{svip.title}</div>
                </div>
                <span className="text-sm text-slate-400">{svip.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
