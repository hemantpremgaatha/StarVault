import type { VaultState } from "@/lib/vault/types";
import { rowClass, SectionHeading } from "../ui";

export function LogsView({ state }: { state: VaultState }) {
  return (
    <div className="grid gap-6">
      <SectionHeading eyebrow="Audit trails" title="Access logs" />
      <div className="grid gap-2">
        {state.logs.length ? (
          state.logs.map((item) => (
            <div key={item.id} className={rowClass}>
              <strong className="text-white">{item.action}</strong>
              <span className="text-xs text-slate-400">{new Date(item.at).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className={rowClass}>
            <strong className="text-white">No activity yet</strong>
            <span className="text-sm text-slate-400">Unlock and use the vault</span>
          </div>
        )}
      </div>
    </div>
  );
}
