import type { VaultState } from "@/lib/vault/types";
import { rowClass, SectionHeading } from "../ui";

const CONNECTORS = ["Google Takeout", "Apple Health", "Bank CSV", "LinkedIn Export", "AI Chat Export", "Manual Upload"];

export function ImportsView({ state, onImport }: { state: VaultState; onImport: (source: string) => void }) {
  return (
    <div className="grid gap-6">
      <SectionHeading eyebrow="Data import from apps" title="Bring your data into StarVault" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CONNECTORS.map((source) => (
          <button
            key={source}
            onClick={() => onImport(source)}
            className="min-h-[84px] rounded-card border border-white/10 bg-white/[0.035] font-black text-white shadow-[0_0_50px_rgba(59,130,246,0.08)] hover:border-cyan/40"
          >
            {source}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {state.imports.length ? (
          state.imports.map((item) => (
            <div key={item.id} className={rowClass}>
              <div>
                <strong className="text-white">{item.source}</strong>
                <div className="text-sm font-bold text-slate-400">{item.summary}</div>
              </div>
              <span className="text-xs text-slate-400">{new Date(item.at).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className={rowClass}>
            <strong className="text-white">No imports yet</strong>
            <span className="text-sm text-slate-400">Connect a source above</span>
          </div>
        )}
      </div>
    </div>
  );
}
