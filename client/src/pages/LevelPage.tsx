import Navbar from "@/components/Navbar";
import ProgressTracker from "@/components/ProgressTracker";
import TopicCard from "@/components/TopicCard";
import { courseLevels } from "@/lib/courseData";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

export default function LevelPage() {
  const params = useParams<{ id: string }>();
  const levelId = parseInt(params.id || "1", 10);
  const level = courseLevels.find((l) => l.id === levelId);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const prevLevel = courseLevels.find((l) => l.id === levelId - 1);
  const nextLevel = courseLevels.find((l) => l.id === levelId + 1);

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
      const el = document.getElementById("topic-" + topic.id);
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-mono text-2xl text-[var(--foreground)]">Nível não encontrado</h1>
          <Link href="/" className="font-mono text-sm text-[var(--primary)]">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  const isAmber = level.accentColor === "amber";
  const topicsForTracker = level.topics.map((t) => ({ id: t.id, title: t.title }));

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden pt-16">
        <div className="relative h-64 sm:h-80">
          {level.image ? (
            <img src={level.image} alt={level.title} className="h-full w-full object-cover opacity-50" />
          ) : (
            <div className={"h-full w-full " + (isAmber ? "bg-[var(--accent)]/10" : "bg-[var(--primary)]/10")} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/60 to-[var(--background)]" />
          <div className="absolute left-0 right-0 top-6">
            <div className="container mx-auto max-w-6xl px-4">
              <nav className="flex items-center gap-2 font-mono text-xs text-[var(--muted-foreground)]">
                <Link href="/" className="text-[var(--muted-foreground)] no-underline transition-colors hover:text-[var(--primary)]">Início</Link>
                <ChevronRight size={12} />
                <span className={isAmber ? "text-[var(--accent)]" : "text-[var(--primary)]"}>Nivel {String(level.id).padStart(2, "0")}</span>
              </nav>
            </div>
          </div>
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto max-w-6xl px-4">
              <span className={"font-mono text-xs uppercase tracking-widest " + (isAmber ? "text-[var(--accent)]/80" : "text-[var(--primary)]/80")}>{level.subtitle}</span>
              <h1 className="mt-2 font-mono text-3xl font-bold text-[var(--foreground)] sm:text-4xl lg:text-5xl">{level.title}</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--muted-foreground)]">{level.description}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <span className={"rounded border px-3 py-1 font-mono " + (isAmber ? "border-[var(--accent)]/30 text-[var(--accent)]" : "border-[var(--primary)]/30 text-[var(--primary)]")}>{level.topics.length} módulos</span>
          </div>
        </div>
      </section>
      <section className="py-10 pb-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex gap-10">
            <ProgressTracker topics={topicsForTracker} activeIndex={activeTopicIndex} accentColor={level.accentColor} />
            <div className="flex-1 space-y-6">
              {level.topics.map((topic, index) => (
                <div key={topic.id} id={"topic-" + topic.id}>
                  <TopicCard topic={topic} index={index} levelId={level.id} accentColor={level.accentColor} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-[var(--border)]/30 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            {prevLevel ? (
              <Link href={"/level/" + prevLevel.id} className="group flex items-center gap-3 no-underline">
                <ArrowLeft size={16} className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]" />
                <div>
                  <span className="block font-mono text-xs text-[var(--muted-foreground)]">Nível anterior</span>
                  <span className="font-mono text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">{prevLevel.title}</span>
                </div>
              </Link>
            ) : (
              <Link href="/" className="group flex items-center gap-3 no-underline">
                <ArrowLeft size={16} className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]" />
                <div>
                  <span className="block font-mono text-xs text-[var(--muted-foreground)]">Voltar</span>
                  <span className="font-mono text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">Página Inicial</span>
                </div>
              </Link>
            )}
            {nextLevel ? (
              <Link href={"/level/" + nextLevel.id} className="group flex items-center gap-3 no-underline text-right">
                <div>
                  <span className="block font-mono text-xs text-[var(--muted-foreground)]">Próximo nível</span>
                  <span className="font-mono text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">{nextLevel.title}</span>
                </div>
                <ArrowRight size={16} className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--primary)]" />
              </Link>
            ) : (
              <div className="text-right">
                <span className="block font-mono text-xs text-[var(--muted-foreground)]">Parabéns!</span>
                <span className="font-mono text-sm text-[var(--accent)]">Curso Completo</span>
              </div>
            )}
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
