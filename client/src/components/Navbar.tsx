/*
 * ─── Blueprint Engineering Theme ───
 * Navbar: Fixed top, translucent navy with cyan border-bottom
 */

import { levels } from "@/lib/courseData";
import { Menu, Cpu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-8 h-8 rounded border border-primary/60 flex items-center justify-center">
            <Cpu size={16} className="text-primary" />
          </div>
          <span className="font-mono text-foreground font-semibold text-sm tracking-wide hidden sm:block">
            JAVA SYSTEM DESIGN
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-2 rounded text-sm font-medium transition-colors no-underline ${
              location === "/" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Início
          </Link>
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/level/${level.id}`}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors no-underline ${
                location === `/level/${level.id}`
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="font-mono text-xs text-primary/60 mr-1">0{level.id}</span>
              {level.subtitle}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-3 rounded text-sm font-medium no-underline ${
                location === "/" ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
            >
              Início
            </Link>
            {levels.map((level) => (
              <Link
                key={level.id}
                href={`/level/${level.id}`}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-3 rounded text-sm font-medium no-underline ${
                  location === `/level/${level.id}`
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                }`}
              >
                <span className="font-mono text-xs text-primary/60 mr-2">0{level.id}</span>
                {level.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
