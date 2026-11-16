import Link from "next/link";

export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1f3a34" />
      <path d="M9 22V9h8a4.5 4.5 0 0 1 0 9h-3.5" fill="none" stroke="#f6f3ec" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22.5" cy="23" r="2.2" fill="#b8863b" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`serif text-2xl flex items-center gap-2 ${light ? "text-white" : "text-ink"}`}>
      <Mark />
      JurisPilot
    </Link>
  );
}

const links = [
  ["/product", "Platform"],
  ["/solutions", "Solutions"],
  ["/pricing", "Pricing"],
  ["/about", "Company"],
];

export function Nav() {
  return (
    <header className="border-b border-line bg-paper/95 sticky top-0 z-30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
        <Logo />
        <nav className="hidden md:flex gap-8 text-sm text-ink2" aria-label="Main">
          {links.map(([h, l]) => <Link key={h} href={h} className="hover:text-ink">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost">Log in</Link>
          <Link href="/signup" className="btn btn-primary">Sign up</Link>
        </div>
      </div>
      <nav className="md:hidden flex gap-6 px-5 pb-3 text-sm text-ink2 overflow-x-auto" aria-label="Main mobile">
        {links.map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap">{l}</Link>)}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand text-white mt-24">
      <div className="max-w-6xl mx-auto px-5 py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="max-w-sm">
          <Logo light />
          <p className="mt-4 text-sm text-white/70">JurisPilot output is a draft for qualified professional review. It is not legal advice.</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="Footer">
          {[...links, ["/login", "Log in"], ["/signup", "Sign up"]].map(([h, l]) => <Link key={h} href={h} className="hover:underline">{l}</Link>)}
        </nav>
      </div>
      <div className="border-t border-white/10 text-xs text-white/50 py-5 text-center">© {new Date().getFullYear()} JurisPilot. All rights reserved.</div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (<><Nav /><main className="flex-1">{children}</main><Footer /></>);
}
