import Link from "next/link";

export function Mark({ height = 30, light = false }: { height?: number; light?: boolean }) {
  const navy = light ? "#ffffff" : "#0f1b3d";
  return (
    <svg height={height} viewBox="0 0 48 56" aria-hidden="true">
      <path d="M3 9h13v27c0 7-5 12-12 12H1v-7h2c3 0 5-2 5-5V16H3z" fill={navy} />
      <path d="M22 6h9l11 11v8H22z" fill="#c08a43" />
      <path d="M22 29h20v4H22zm0 7h20v4H22zm-4 7h24v4H18z" fill={navy} />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="JurisPilot home" className="flex items-center gap-2 text-[1.45rem] font-extrabold tracking-tight leading-none" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <Mark light={light} />
      <span><span className={light ? "text-white" : "text-brand"}>Juris</span><span className="text-accent">Pilot</span></span>
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
