import Link from "next/link";
import { ArrowRight } from "lucide-react";

const particles = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 23) % 100}%`,
  top: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * 0.75}s`,
  duration: `${10 + (index % 7)}s`
}));

export function Hero() {
  return (
    <section className="starfield relative min-h-[calc(100vh-73px)] overflow-hidden border-b border-white/10">
      <div className="particle-field">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col items-center gap-10 px-6 py-20 text-center">
        <p className="text-sm font-black uppercase tracking-normal text-cyan/80">StarVault Protocol</p>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-[460px] w-[460px] rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative aspect-square w-[280px] overflow-hidden rounded-3xl border border-cyan/30 bg-white shadow-[0_0_70px_rgba(34,211,238,0.28)] sm:w-[340px]">
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/starvault-logo-poster.jpg`}
            >
              <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/starvault-logo.mp4`} type="video/mp4" />
            </video>
          </div>
        </div>

        <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-normal text-white md:text-6xl lg:text-7xl">
          Surveillance capitalism ends here.
          <span className="mt-3 block text-cyan">Consent becomes the protocol.</span>
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">
          StarVault is the open protocol where every access request states its purpose, every grant carries an expiry, and revocation is instant — enforced by encryption, not a privacy policy.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/developers" className="inline-flex items-center gap-2 rounded-card bg-white px-5 py-3 font-black text-midnight">
            Help build the next layer <ArrowRight size={18} />
          </Link>
          <Link href="/protocol" className="inline-flex items-center gap-2 rounded-card border border-cyan/40 bg-cyan/10 px-5 py-3 font-black text-cyan">
            Read the protocol
          </Link>
        </div>
      </div>
    </section>
  );
}
