"use client";

import { useRef } from "react";
import type { VaultState } from "@/lib/vault/types";
import { cardClass, DangerButton, SectionHeading } from "../ui";

const CATEGORIES = ["Identity", "Health", "Finance", "Employment", "AI Training"];

const inputClass =
  "w-full rounded-card border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan/50";

export function VaultView({
  state,
  onAddRecord,
  onDeleteRecord
}: {
  state: VaultState;
  onAddRecord: (title: string, category: string, details: string) => void;
  onDeleteRecord: (id: string) => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const title = titleRef.current?.value.trim();
    const details = detailsRef.current?.value.trim();
    const category = categoryRef.current?.value ?? CATEGORIES[0];
    if (!title || !details) return;
    onAddRecord(title, category, details);
    if (titleRef.current) titleRef.current.value = "";
    if (detailsRef.current) detailsRef.current.value = "";
  }

  return (
    <div className="grid gap-6">
      <SectionHeading eyebrow="Encrypted storage" title="Secure personal records" />

      <form onSubmit={handleSubmit} className={`${cardClass} grid gap-3 sm:grid-cols-[1fr_180px]`}>
        <input ref={titleRef} placeholder="Record title" required className={inputClass} />
        <select ref={categoryRef} aria-label="Category" className={inputClass} defaultValue={CATEGORIES[0]}>
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <textarea
          ref={detailsRef}
          placeholder="Private details, IDs, notes, or access instructions"
          required
          className={`${inputClass} min-h-[100px] sm:col-span-2`}
        />
        <button
          type="submit"
          className="rounded-card bg-white px-4 py-2.5 text-sm font-black text-midnight hover:bg-slate-200 sm:col-span-2"
        >
          Add encrypted record
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.vault.map((item) => (
          <article key={item.id} className={`${cardClass} grid gap-2`}>
            <span className="text-xs font-black uppercase text-cyan">{item.category}</span>
            <h3 className="text-lg font-black text-white">{item.title}</h3>
            <p className="text-sm leading-6 text-slate-400">{item.details}</p>
            <div>
              <DangerButton onClick={() => onDeleteRecord(item.id)}>Delete</DangerButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
