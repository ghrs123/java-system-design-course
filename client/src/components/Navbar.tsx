import { courseLevels } from "@/lib/courseData";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border)]/50 bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-[var(--primary)]/60">
            <span className="font-mono text-sm font-bold text-[var(--primary)]">SD</span>
          </div>
          <span className="hidden font-mono text-sm font-semibold tracking-wide text-[var(--foreground)] sm:block">JAVA SYSTEM DESIGN</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/" className={"rounded px-3 py-2 text-sm font-medium no-underline transition-colors " + (location === "/" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}>Início</Link>
          {courseLevels.map((level) => (
            <Link key={level.id} href={"/level/" + level.id} className={"rounded px-3 py-2 text-sm font-medium no-underline transition-colors " + (location === "/level/" + level.id ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}>
              <span className="mr-1 font-mono text-xs text-[var(--primary)]/60">0{level.id}</span>
              {level.subtitle}
            </Link>
          ))}
        </div>
        <button className="p-2 text-[var(--foreground)] md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-t border-[var(--border)]/50 bg-[var(--background)]/95 backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className={"rounded px-3 py-3 text-sm font-medium no-underline " + (location === "/" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--muted-foreground)]")}>Início</Link>
            {courseLevels.map((level) => (
              <Link key={level.id} href={"/level/" + level.id} onClick={() => setMobileOpen(false)} className={"rounded px-3 py-3 text-sm font-medium no-underline " + (location === "/level/" + level.id ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--muted-foreground)]")}>
                <span className="mr-2 font-mono text-xs text-[var(--primary)]/60">0{level.id}</span>
                {level.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
