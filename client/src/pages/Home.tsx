import LevelCard from "@/components/LevelCard";
import Navbar from "@/components/Navbar";
import { courseLevels } from "@/lib/courseData";
import { ArrowDown, BookOpen, Code2, Database, Server } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/10 via-[var(--background)] to-[var(--background)]" />
        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-4 py-1.5 font-mono text-xs tracking-wider text-[var(--primary)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
              CURSO JAVA SYSTEM DESIGN
            </span>
          </div>
          <h1 className="mb-6 font-mono text-4xl font-bold leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Curso de System Design <span className="text-[var(--primary)]">em Java</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)] sm:text-xl">
            Quatro níveis: fundamentos, escalabilidade, sistemas distribuídos e arquitetura de produção.
          </p>
          <div className="mb-12 flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { icon: Server, label: "4 Níveis", sublabel: "de aprendizado" },
              { icon: Code2, label: "15 Módulos", sublabel: "com código" },
              { icon: Database, label: "Teoria + Prática", sublabel: "em cada módulo" },
              { icon: BookOpen, label: "Projetos", sublabel: "integradores" },
            ].map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded border border-[var(--primary)]/30 bg-[var(--primary)]/5">
                  <Icon size={18} className="text-[var(--primary)]" />
                </div>
                <div className="text-left">
                  <div className="font-mono text-sm font-semibold text-[var(--foreground)]">{label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{sublabel}</div>
                </div>
              </div>
            ))}
          </div>
          <a href="#levels" className="inline-flex flex-col items-center gap-2 text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]">
            <span className="font-mono text-xs tracking-wider">VER NÍVEIS</span>
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </div>
      </section>
      <section id="levels" className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--primary)]/60">Percurso do Curso</span>
            <h2 className="mt-3 mb-4 font-mono text-3xl font-bold text-[var(--foreground)] sm:text-4xl">Escolha o Nivel</h2>
            <p className="mx-auto max-w-xl text-[var(--muted-foreground)]">Cada nível contém módulos com teoria, exercícios, soluções e código.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[var(--primary)]/40 via-[var(--primary)]/20 to-[var(--accent)]/40 lg:block" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {courseLevels.map((level, index) => (
                <LevelCard key={level.id} level={level} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-[var(--border)]/20 py-8">
        <div className="container text-center">
          <p className="font-mono text-xs text-[var(--muted-foreground)]">Java System Design Course</p>
        </div>
      </footer>
    </div>
  );
}
