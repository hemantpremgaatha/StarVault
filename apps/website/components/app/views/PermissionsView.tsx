import type { VaultState } from "@/lib/vault/types";
import { riskClass } from "@/lib/vault/logic";
import { ApproveButton, cardClass, DangerButton, SecondaryButton, SectionHeading } from "../ui";

export function PermissionsView({
  state,
  onApprove,
  onRevoke,
  onLoadSample
}: {
  state: VaultState;
  onApprove: (id: string) => void;
  onRevoke: (id: string) => void;
  onLoadSample: () => void;
}) {
  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="Permission dashboard"
        title="Deny by default, approve by consent"
        action={<SecondaryButton onClick={onLoadSample}>Load sample requests</SecondaryButton>}
      />

      <div className={`${cardClass} border-electric-blue/25 bg-electric-blue/[0.06]`}>
        <strong className="text-white">Consent policy</strong>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          New company requests stay pending until the user approves a purpose, scope, expiry date, and revocation right.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.permissions.map((item) => (
          <article key={item.id} className={`${cardClass} grid gap-2`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-400">
                  {item.status} until {item.expiresAt}
                </span>
                <h3 className="text-lg font-black text-white">{item.company}</h3>
              </div>
              <strong className={riskClass(item.risk)}>{item.risk}</strong>
            </div>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Scope:</strong> {item.scope}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Purpose:</strong> {item.purpose}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">Extraction type:</strong> {item.extractionType}
            </p>
            <p className="text-sm text-slate-300">
              <strong className="text-white">User benefit:</strong> {item.userBenefit}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.status !== "Active" && <ApproveButton onClick={() => onApprove(item.id)}>Approve</ApproveButton>}
              {item.status !== "Revoked" && <DangerButton onClick={() => onRevoke(item.id)}>Revoke</DangerButton>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
