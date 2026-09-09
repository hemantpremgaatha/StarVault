import type { ReactNode } from "react";

export const cardClass =
  "rounded-card border border-white/10 bg-white/[0.035] p-5 shadow-[0_0_50px_rgba(59,130,246,0.08)]";

export const rowClass =
  "flex items-center justify-between gap-4 rounded-card border border-white/10 bg-white/[0.03] p-4";

export function SectionHeading({
  eyebrow,
  title,
  action
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-normal text-cyan">{eyebrow}</p>
        <h3 className="mt-1 text-2xl font-black text-white">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function baseButton(extra: string) {
  return `inline-flex items-center gap-2 whitespace-nowrap rounded-card px-4 py-2 text-sm font-black transition-colors ${extra}`;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return <button {...rest} className={`${baseButton("bg-white text-midnight hover:bg-slate-200")} ${className ?? ""}`} />;
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`${baseButton("border border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20")} ${className ?? ""}`}
    />
  );
}

export function DangerButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`${baseButton(
        "border border-red-400/40 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
      )} ${className ?? ""}`}
    />
  );
}

export function ApproveButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`${baseButton(
        "border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-400/20"
      )} ${className ?? ""}`}
    />
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className={rowClass}>
      <div>
        <strong className="text-white">{title}</strong>
      </div>
      <span className="text-sm text-slate-400">{hint}</span>
    </div>
  );
}

export function Meta({ children }: { children: ReactNode }) {
  return <div className="text-sm font-bold text-slate-400">{children}</div>;
}
