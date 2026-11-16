import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`serif text-2xl flex items-center gap-2 ${light ? "text-white" : "text-ink"}`}>
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent" />
      JurisPilot
    </Link>
  );
}

const links = [
  ["/product", "Product"],
  ["/solutions", "Solutions"],
  ["/pricing", "Pricing"],
  ["/about", "Company"],
  ["/contact", "Contact"],
];

export function Nav() {
  return (
    <header className="border-b border-line bg-paper/95 sticky top-0 z-30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex gap-7 text-sm text-ink2">
          {links.map(([h, l]) => <Link key={h} href={h} className="hover:text-ink">{l}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost hidden sm:inline-flex">Sign in</Link>
          <Link href="/signup" className="btn btn-primary">Start free</Link>
        </div>
      </div>
      <nav className="md:hidden flex gap-5 px-5 pb-3 text-sm text-ink2 overflow-x-auto">
        {links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand text-white mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 text-sm text-white/70 max-w-sm">An AI workspace for legal teams. JurisPilot assists with drafting and review; it does not provide legal advice and its output should be checked by a qualified professional.</p>
        </div>
        <div className="text-sm space-y-2"><p className="text-white/50">Product</p>
          <Link className="block" href="/product">Overview</Link><Link className="block" href="/solutions">Solutions</Link><Link className="block" href="/pricing">Pricing</Link></div>
        <div className="text-sm space-y-2"><p className="text-white/50">Company</p>
          <Link className="block" href="/about">About</Link><Link className="block" href="/contact">Contact</Link><Link className="block" href="/login">Sign in</Link></div>
      </div>
      <div className="border-t border-white/10 text-xs text-white/50 py-5 text-center">© {new Date().getFullYear()} JurisPilot. Not affiliated with any other legal technology company.</div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (<><Nav /><main className="flex-1">{children}</main><Footer /></>);
}
