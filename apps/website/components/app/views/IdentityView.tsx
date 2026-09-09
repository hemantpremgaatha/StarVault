"use client";

import { useRef } from "react";
import type { Identity, VaultState } from "@/lib/vault/types";
import { cardClass, SectionHeading } from "../ui";

const inputClass =
  "mt-1.5 w-full rounded-card border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan/50";
const labelClass = "text-sm font-bold text-slate-400";

export function IdentityView({ state, onSave }: { state: VaultState; onSave: (identity: Identity) => void }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const idStatusRef = useRef<HTMLSelectElement>(null);
  const consentTermRef = useRef<HTMLSelectElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSave({
      name: nameRef.current?.value ?? "",
      email: emailRef.current?.value ?? "",
      phone: phoneRef.current?.value ?? "",
      country: countryRef.current?.value ?? "",
      idStatus: idStatusRef.current?.value ?? "Not verified",
      consentTerm: consentTermRef.current?.value ?? "Ask every time"
    });
  }

  return (
    <div className="grid gap-6">
      <SectionHeading eyebrow="Identity vault" title="Verified profile" />
      <form onSubmit={handleSubmit} className={`${cardClass} grid gap-4 sm:grid-cols-2`}>
        <label className={labelClass}>
          Full name
          <input ref={nameRef} defaultValue={state.identity.name} className={inputClass} />
        </label>
        <label className={labelClass}>
          Email
          <input ref={emailRef} type="email" defaultValue={state.identity.email} className={inputClass} />
        </label>
        <label className={labelClass}>
          Phone
          <input ref={phoneRef} defaultValue={state.identity.phone} className={inputClass} />
        </label>
        <label className={labelClass}>
          Country
          <input ref={countryRef} defaultValue={state.identity.country} className={inputClass} />
        </label>
        <label className={labelClass}>
          Government ID status
          <select ref={idStatusRef} defaultValue={state.identity.idStatus} className={inputClass}>
            <option>Not verified</option>
            <option>Pending</option>
            <option>Verified</option>
          </select>
        </label>
        <label className={labelClass}>
          Preferred consent term
          <select ref={consentTermRef} defaultValue={state.identity.consentTerm} className={inputClass}>
            <option>Ask every time</option>
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
          </select>
        </label>
        <button type="submit" className="rounded-card bg-white px-4 py-2.5 text-sm font-black text-midnight hover:bg-slate-200 sm:col-span-2">
          Save identity
        </button>
      </form>
    </div>
  );
}
