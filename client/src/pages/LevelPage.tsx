/*
 * ─── Blueprint Engineering Theme ───
 * LevelPage: Detail page for each level
 */

import Navbar from "@/components/Navbar";
import ProgressTracker from "@/components/ProgressTracker";
import TopicCard from "@/components/TopicCard";
import { levels } from "@/lib/courseData";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

export default function LevelPage() {
  const params = useParams<{ id: string }>();
  const levelId = parseInt(params.id || "1", 10);
  const level = levels.find((l) => l.id === levelId);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const prevLevel = levels.find((l) => l.id === levelId - 1);
  const nextLevel = levels.find((l) => l.id === levelId + 1);

  useEffect(() => {
    if (!level) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              const topicId = id.replace("topic-", "");
              const idx = level.topics.findIndex((t) => t.id === topicId);
              if (idx >= 0) setActiveTopicIndex(idx);
            }
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    level.topics.forEach((topic) => {
      const el = document.getElementById(`topic-${topic.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [level]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTopicIndex(0);
  }, [levelId]);

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-mono text-2xl text-foreground mb-4">Nível não encontrado</h1>
          <Link href="/" className="text-primary font-mono text-sm">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const isAmber = level.accentColor === "amber";
  const accentColor = isAmber ? "amber" : "cyan";

  const levelGradients = [
    "from-cyan-500/15 to-primary/5",
    "from-cyan-500/15 to-amber-500/10",
    "from-amber-500/15 to-amber-500/5",
    "from-amber-500/15 to-primary/5",
  ];

  const totalExercises = level.topics.reduce(
    (acc, t) => acc + (t.exercises?.length || 0), 0
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── Level Hero ─── */}
      <section className="relative pt-16 overflow-hidden">
        <div className={`relative h-56 sm:h-72 bg-gradient-to-br ${levelGradients[levelId - 1]}`}>
          {/* Blueprint grid */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0">
            <div className="container max-w-6xl mx-auto px-4">
              <nav className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Link href="/" className="hover:text-primary transition-colors no-underline text-muted-foreground">
                  Início
                </Link>
                <ChevronRight size={12} />
                <span className={isAmber ? "text-accent" : "text-primary"}>
                  Nível {String(level.id).padStart(2, "0")}
                </span>
              </nav>
            </div>
          </div>

          {/* Level title */}
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container max-w-6xl mx-auto px-4">
              <span className={`font-mono text-xs uppercase tracking-widest ${
                isAmber ? "text-accent/80" : "text-primary/80"
              }`}>
                {level.subtitle}
              </span>
              <h1 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-2">
                {level.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Level Description ─── */}
      <section className="py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
            {level.description}
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className={`font-mono px-3 py-1 rounded border ${
              isAmber ? "border-accent/30 text-accent" : "border-primary/30 text-primary"
            }`}>
              {level.topics.length} tópicos
            </span>
            <span className="font-mono text-xs text-muted-foreground/60">
              {level.topics.reduce((acc, t) => acc + t.concepts.length, 0)} conceitos
            </span>
            <span className="font-mono text-xs text-muted-foreground/60">
              {totalExercises} exercícios práticos
            </span>
            <span className="font-mono text-xs text-muted-foreground/60">
              {level.topics.reduce((acc, t) => acc + t.codeExamples.length, 0)} exemplos de código
            </span>
          </div>
        </div>
      </section>

      {/* ─── Topics with Progress Tracker ─── */}
      <section className="py-10 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex gap-10">
            <ProgressTracker
              topics={level.topics}
              activeIndex={activeTopicIndex}
              accentColor={accentColor as "cyan" | "amber"}
            />
            <div className="flex-1 space-y-6">
              {level.topics.map((topic, index) => (
                <div key={topic.id} id={`topic-${topic.id}`}>
                  <TopicCard
                    topic={topic}
                    index={index}
                    accentColor={accentColor as "cyan" | "amber"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Level Navigation ─── */}
      <section className="py-12 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {prevLevel ? (
              <Link href={`/level/${prevLevel.id}`} className="flex items-center gap-3 group no-underline">
                <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <span className="text-xs text-muted-foreground font-mono block">Nível anterior</span>
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">
                    {prevLevel.title}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/" className="flex items-center gap-3 group no-underline">
                <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <span className="text-xs text-muted-foreground font-mono block">Voltar</span>
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">
                    Página Inicial
                  </span>
                </div>
              </Link>
            )}

            {nextLevel ? (
              <Link href={`/level/${nextLevel.id}`} className="flex items-center gap-3 group no-underline text-right">
                <div>
                  <span className="text-xs text-muted-foreground font-mono block">Próximo nível</span>
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">
                    {nextLevel.title}
                  </span>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ) : (
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-mono block">Parabéns!</span>
                <span className="text-sm font-mono amber-glow text-accent">Curso Completo</span>
              </div>
            )}
          </div>
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
