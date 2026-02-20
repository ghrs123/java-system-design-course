import type { CourseLevel } from "@/lib/courseData";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface LevelCardProps {
  level: CourseLevel;
  index: number;
}

export default function LevelCard({ level, index }: LevelCardProps) {
  const isAmber = level.accentColor === "amber";

  return (
    <div
      className="overflow-hidden rounded-lg bg-[var(--card)]/40 backdrop-blur-sm"
      style={{
        animationDelay: `${index * 150}ms`,
        animation: "float-up 0.7s ease-out forwards",
        opacity: 0,
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {level.image ? (
          <img
            src={level.image}
            alt={level.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`h-full w-full ${
              isAmber
                ? "bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5"
                : "bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5"
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/40 to-transparent" />
        <div className="absolute left-4 top-4">
          <span
            className={
              isAmber
                ? "rounded border border-[var(--accent)]/30 bg-[var(--accent)]/20 px-2.5 py-1 font-mono text-xs font-bold text-[var(--accent)]"
                : "rounded border border-[var(--primary)]/30 bg-[var(--primary)]/20 px-2.5 py-1 font-mono text-xs font-bold text-[var(--primary)]"
            }
          >
            NÍVEL {String(level.id).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <span
            className={
              isAmber
                ? "font-mono text-xs uppercase tracking-widest text-[var(--accent)]/80"
                : "font-mono text-xs uppercase tracking-widest text-[var(--primary)]/80"
            }
          >
            {level.subtitle}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-3 font-mono text-xl font-bold text-[var(--foreground)]">
          {level.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {level.description}
        </p>
        <div className="mb-5 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <BookOpen size={14} />
          <span>{level.topics.length} módulos</span>
        </div>
        <Link
          href={`/level/${level.id}`}
          className={
            isAmber
              ? "inline-flex items-center gap-2 rounded border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2.5 font-mono text-sm font-semibold text-[var(--accent)] no-underline transition-all hover:bg-[var(--accent)]/20"
              : "inline-flex items-center gap-2 rounded border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2.5 font-mono text-sm font-semibold text-[var(--primary)] no-underline transition-all hover:bg-[var(--primary)]/20"
          }
        >
          Ver Módulos
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
