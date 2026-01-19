import Link from "next/link"

export function Header() {
  return (
    <header className="relative z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          <span className="text-foreground">Flight</span>
          <span className="ml-0.5 text-cyan-500">33</span>
        </Link>

        {/* Desktop links */}
        <nav className="ml-auto hidden md:flex items-center gap-6">
          <Link
            href="/flights"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
        </nav>
      </div>
    </header>
  )
}
