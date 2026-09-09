import type { VaultState } from "@/lib/vault/types";
import { statusClass } from "@/lib/vault/logic";
import { cardClass, PrimaryButton, SectionHeading } from "../ui";

export function RoadmapView({ state, onComplete }: { state: VaultState; onComplete: () => void }) {
  return (
    <div className="grid gap-6">
      <SectionHeading
        eyebrow="Execution roadmap"
        title="Build the protocol, platform, and ecosystem in sequence"
        action={<PrimaryButton onClick={onComplete}>Complete next milestone</PrimaryButton>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.roadmap.phases.map((phase) => (
          <article key={phase.phase} className={`${cardClass} grid gap-3`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-400">{phase.phase}</span>
                <h3 className="text-lg font-black text-white">{phase.title}</h3>
              </div>
              <em className={`text-xs font-black uppercase not-italic ${statusClass(phase.status)}`}>{phase.status}</em>
            </div>
            <p className="text-sm leading-6 text-slate-400">{phase.objective}</p>
            <div className="grid gap-1.5">
              {phase.milestones.map((milestone) => (
                <div
                  key={milestone.title}
                  className="flex items-center justify-between gap-2 rounded-card border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <strong className="text-sm text-white">{milestone.title}</strong>
                  <em className={`text-xs font-black uppercase not-italic ${statusClass(milestone.status)}`}>{milestone.status}</em>
                </div>
              ))}
            </div>
            <div className="rounded-card border border-emerald-400/25 bg-emerald-400/[0.08] p-3 text-sm font-bold text-emerald-200">
              {phase.metric}
            </div>
          </article>
        ))}
      </div>

      <section className={cardClass}>
        <p className="text-xs font-black uppercase tracking-normal text-cyan">Next 90 days</p>
        <h3 className="mt-1 text-xl font-black text-white">Founder operating plan</h3>
        <div className="mt-4 grid gap-2">
          {state.roadmap.sprints.map(([period, task]) => (
            <div key={period} className="rounded-card border border-white/10 bg-white/[0.03] p-3">
              <strong className="text-sm text-white">{period}</strong>
              <p className="mt-1 text-sm text-slate-400">{task}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
