/*
 * ─── Blueprint Engineering Theme ───
 * Home: Hero section with blueprint background, level cards grid
 * Dark navy bg, cyan wireframe lines, amber accents
 */

import LevelCard from "@/components/LevelCard";
import Navbar from "@/components/Navbar";
import { levels } from "@/lib/courseData";
import { ArrowDown, Cpu, Database, Network, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Blueprint grid background enhancement */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          {/* Blueprint decorative lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blueprint-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="oklch(0.75 0.16 200)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              PRODUCTION ENGINEERING ROADMAP
            </span>
          </div>

          <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Java{" "}
            <span className="blueprint-glow text-primary">System Design</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            Um roadmap completo para engenheiros backend que querem construir sistemas distribuídos
            de produção com Java — do iniciante ao arquiteto de software.
          </p>

          <p className="text-primary/60 font-mono text-sm mb-10">
            Não é prep para entrevistas. É engenharia de produção.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12">
            {[
              { icon: Layers, label: "4 Níveis", sublabel: "de proficiência" },
              { icon: Cpu, label: "15 Módulos", sublabel: "de estudo" },
              { icon: Database, label: "Exercícios", sublabel: "práticos incluídos" },
              { icon: Network, label: "Produção", sublabel: "foco em sistemas reais" },
            ].map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded border border-primary/30 bg-primary/5 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-mono text-sm font-semibold text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{sublabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <a
            href="#levels"
            className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs font-mono tracking-wider">EXPLORAR</span>
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* ─── Levels Grid ─── */}
      <section id="levels" className="py-20 sm:py-28">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-primary/60 tracking-widest uppercase">
              Percurso de Aprendizagem
            </span>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
              Escolha o Seu Nível
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Cada nível constrói sobre o anterior. Comece pelos fundamentos e avance
              progressivamente até dominar arquitetura de sistemas distribuídos de produção.
            </p>
          </div>

          {/* Vertical timeline connector */}
          <div className="relative">
            {/* Center line (desktop only) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-accent/40 -translate-x-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {levels.map((level, index) => (
                <LevelCard key={level.id} level={level} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Philosophy ─── */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-mono tracking-wider uppercase mb-3">
            Filosofia do Curso
          </p>
          <blockquote className="font-mono text-lg font-semibold text-foreground mb-4">
            "Sistemas de produção não falham por falta de features. Falham por falta de fundamentos."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Cada módulo inclui teoria, exemplos de código Java reais, exercícios práticos com soluções,
            e boas práticas de produção aprendidas em sistemas de alta escala.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 border-t border-border/20">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Java System Design Course &mdash; Construído para engenheiros que querem dominar sistemas distribuídos
          </p>
        </div>
      </footer>
    </div>
  );
}
