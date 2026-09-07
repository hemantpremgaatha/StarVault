const pillars = [
  ["StarVault Identity", "A user-owned identity containing credentials, records, preferences, devices, AI memory, and access history."],
  ["Connect With StarVault", "Applications request precise permissions instead of creating platform-owned accounts."],
  ["AI Permission Layer", "AI agents ask for temporary context and every access is scoped, auditable, and revocable."],
  ["Global Federation", "Universities, hospitals, governments, enterprises, clouds, and personal servers run interoperable nodes."],
  ["Open Governance", "SVIPs evolve identity, consent, vaults, AI permissions, federation, and data capability tokens."],
  ["Research Agenda", "Privacy-preserving AI, verifiable credentials, zero-knowledge proofs, confidential computing, and personal AI governance."]
];

export default function VisionPage() {
  return (
    <main className="bg-midnight">
      <section className="starfield px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-normal text-cyan">StarVault 2035</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight text-white md:text-7xl">
            There is no final version. There is a protocol that keeps becoming infrastructure.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            The ambition is not that people say they use StarVault. The ambition is that applications say they support StarVault, the way they support HTTP, TLS, and OAuth.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3">
        {pillars.map(([title, body]) => (
          <article key={title} className="rounded-card border border-white/10 bg-white/[0.035] p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-3 leading-7 text-slate-400">{body}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-white/10 bg-deep-space px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-normal text-cyan">North star</p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black text-white md:text-6xl">
            People should not say, &ldquo;I use StarVault.&rdquo; They should say, &ldquo;This app supports StarVault.&rdquo;
          </h2>
        </div>
      </section>
    </main>
  );
}
