import type { VaultState } from "@/lib/vault/types";
import { riskClass } from "@/lib/vault/logic";
import { cardClass, PrimaryButton, SectionHeading } from "../ui";

export function ScannerView({ state, onRunScan }: { state: VaultState; onRunScan: () => void }) {
  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="AI privacy scanner"
        title="Find sensitive exposure"
        action={<PrimaryButton onClick={onRunScan}>Run privacy scan</PrimaryButton>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.findings.length ? (
          state.findings.map((item) => (
            <article key={item.id} className={`${cardClass} grid gap-2`}>
              <span className={`text-xs font-black uppercase ${riskClass(item.risk)}`}>{item.risk} risk</span>
              <h3 className="text-lg font-black text-white">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{item.description}</p>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Source:</strong> {item.source}
              </p>
            </article>
          ))
        ) : (
          <article className={`${cardClass} grid gap-2`}>
            <span className="text-xs font-black uppercase text-cyan">Ready</span>
            <h3 className="text-lg font-black text-white">No findings yet</h3>
            <p className="text-sm text-slate-400">Run the scanner to inspect vault records and permissions for exposure risks.</p>
          </article>
        )}
      </div>
    </div>
  );
}
