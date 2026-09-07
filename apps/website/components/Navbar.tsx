import Link from "next/link";

const links = [
  ["Protocol", "/protocol"],
  ["Vision", "/vision"],
  ["Developers", "/developers"],
  ["Roadmap", "/roadmap"],
  ["Docs", "/docs"],
  ["Whitepaper", "/whitepaper"],
  ["Community", "/community"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-midnight/80 text-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.png`} alt="StarVault" width={500} height={500} className="h-12 w-12 object-contain" />
        </Link>
        <div className="hidden items-center gap-6 text-sm font-bold text-slate-300 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-cyan">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/contact" className="rounded-card border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-black text-cyan">
          Join protocol
        </Link>
      </nav>
    </header>
  );
}
