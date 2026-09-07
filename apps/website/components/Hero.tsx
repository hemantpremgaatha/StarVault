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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl content-center gap-12 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-normal text-cyan/80">StarVault Protocol</p>
          <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-normal text-white md:text-7xl lg:text-8xl">
            The Internet Connected Information.
            <span className="mt-3 block text-cyan">It Is Time To Connect Trust.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            StarVault is the open protocol and platform where applications request permission, users approve with intent, and encrypted access exists only inside consent.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/developers" className="inline-flex items-center gap-2 rounded-card bg-white px-5 py-3 font-black text-midnight">
              Help build the next layer <ArrowRight size={18} />
            </Link>
            <Link href="/protocol" className="inline-flex items-center gap-2 rounded-card border border-cyan/40 bg-cyan/10 px-5 py-3 font-black text-cyan">
              Read the protocol
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[520px] items-center justify-center">
          <div className="absolute h-[420px] w-[420px] rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-3xl border border-cyan/30 bg-white shadow-[0_0_60px_rgba(34,211,238,0.25)]">
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
      </div>
    </section>
  );
}
