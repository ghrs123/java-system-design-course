import type { CourseTopic } from "@/lib/courseData";
import { BookOpen, Code2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface TopicCardProps {
  topic: CourseTopic;
  index: number;
  levelId: number;
  accentColor: "cyan" | "amber";
}

export default function TopicCard({
  topic,
  index,
  levelId,
  accentColor,
}: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);

  const accentClasses =
    accentColor === "cyan"
      ? "hover:border-[var(--primary)]/50 hover:shadow-[0_0_20px_oklch(0.75_0.17_195/0.1)]"
      : "hover:border-[var(--accent)]/50 hover:shadow-[0_0_20px_oklch(0.78_0.17_70/0.1)]";

  const tagColor =
    accentColor === "cyan"
      ? "border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]"
      : "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]";

  const numberColor =
    accentColor === "cyan" ? "text-[var(--primary)]/40" : "text-[var(--accent)]/40";

  return (
    <div
      className={`rounded-lg bg-[var(--card)]/50 p-6 backdrop-blur-sm ${accentClasses}`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "float-up 0.6s ease-out forwards",
        opacity: 0,
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className={`shrink-0 select-none font-mono text-3xl font-bold ${numberColor}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <h3 className="mb-2 font-mono text-lg font-semibold text-[var(--foreground)]">
            {topic.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {topic.description}
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {topic.concepts.slice(0, expanded ? undefined : 4).map((concept) => (
              <span
                key={concept}
                className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium ${tagColor}`}
              >
                <Code2 size={10} />
                {concept}
              </span>
            ))}
            {!expanded && topic.concepts.length > 4 && (
              <span className="self-center text-xs text-[var(--muted-foreground)]">
                +{topic.concepts.length - 4} mais
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/level/${levelId}/module/${topic.moduleSlug}`}
              className={`inline-flex items-center gap-2 rounded border px-3 py-2 font-mono text-xs font-semibold no-underline transition-all ${
                accentColor === "amber"
                  ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20"
                  : "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20"
              }`}
            >
              Abrir Módulo
              <BookOpen size={12} />
            </Link>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? "Recolher" : "Ver recursos"}
            </button>
          </div>
          {expanded && (
            <div className="mt-4 border-t border-[var(--border)]/30 pt-4">
              <h4 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <BookOpen size={12} />
                Recursos do Módulo
              </h4>
              <ul className="space-y-2">
                {topic.resources.map((resource) => (
                  <li
                    key={resource}
                    className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]"
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        accentColor === "cyan" ? "bg-[var(--primary)]/60" : "bg-[var(--accent)]/60"
                      }`}
                    />
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
