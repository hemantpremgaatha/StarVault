import Link from "next/link";

const links = [
  ["Protocol", "/protocol"],
  ["Vision", "/vision"],
  ["Developers", "/developers"],
  ["Roadmap", "/roadmap"],
  ["Docs", "/docs"],
  ["Whitepaper", "/whitepaper"],
  ["Community", "/community"],
  ["Join protocol", "/contact"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight/80 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-black">
          <span className="grid h-10 w-10 place-items-center rounded-card border border-cyan/40 bg-white/5 text-cyan shadow-[0_0_24px_rgba(34,211,238,0.18)]">SV</span>
          <span>StarVault</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-bold text-slate-300 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-cyan">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/app" className="rounded-card border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-black text-cyan">
          Launch app
        </Link>
      </nav>
    </header>
  );
}
